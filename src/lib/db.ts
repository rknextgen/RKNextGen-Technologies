import fs from 'fs';
import path from 'path';
import initialData from '@/data/data.json';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'data.json');

let cachedData: any = null;
let lastMtime: number = 0;

// Helper to read data
const readData = () => {
  try {
    // Try reading from file system first (for local dev updates)
    if (fs.existsSync(DATA_FILE_PATH)) {
      const stats = fs.statSync(DATA_FILE_PATH);
      const mtime = stats.mtimeMs;

      if (!cachedData || mtime > lastMtime) {
        const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
        cachedData = JSON.parse(fileContent);
        lastMtime = mtime;
      }
      return cachedData;
    }
  } catch (error) {
    console.warn('Error reading data file (using initial data):', error);
  }

  // Fallback to imported data (for Vercel/Production where fs might fail or be read-only)
  return cachedData || initialData;
};

// Helper to write data (optional, for basic mutations)
const writeData = (data: any) => {
  try {
    // In Vercel, this might fail if the file system is read-only
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    cachedData = data;
    const stats = fs.statSync(DATA_FILE_PATH);
    lastMtime = stats.mtimeMs;
  } catch (error) {
    console.warn('Error writing data file (expected on Vercel/Read-Only env):', error);
    // Update in-memory cache at least, so it looks like it worked for the current session
    cachedData = data;
  }
};

class MockPrismaClient {
  [key: string]: any;

  constructor() {
    const data = readData();
    const models = [
      'user', 'blog', 'project', 'caseStudy', 'testimonial',
      'teamMember', 'job', 'application', 'lead', 'media',
      'settings', 'pageSEO', 'legalPage', 'pageView'
    ];

    models.forEach(model => {
      // Capitalize for data key (e.g., 'user' -> 'User')
      // Note: In schema it is 'User', 'Blog', etc.
      // But in prisma client usage it is prisma.user, prisma.blog (lowercase)
      const modelName = model.charAt(0).toUpperCase() + model.slice(1);

      this[model] = {
        findMany: async (args: any = {}) => {
          const allItems = readData()[modelName] || [];
          let result = [...allItems];

          // Basic filtering
          if (args.where) {
            result = result.filter(item => {
              return Object.entries(args.where).every(([key, value]) => {
                if (value === undefined) return true;

                // Handle simple equality
                if (typeof value !== 'object' || value === null || value instanceof Date) {
                  return item[key] === value;
                }

                // Handle 'not'
                if ((value as any).not !== undefined) {
                  return item[key] !== (value as any).not;
                }

                // Handle 'contains' (insensitive)
                if ((value as any).contains) {
                  const itemVal = String(item[key] || '').toLowerCase();
                  const searchVal = String((value as any).contains).toLowerCase();
                  return itemVal.includes(searchVal);
                }

                // Handle date comparisons (gte, lte, gt, lt)
                if ((value as any).gte || (value as any).lte || (value as any).gt || (value as any).lt) {
                  const itemDate = new Date(item[key]);
                  let matches = true;
                  if ((value as any).gte) matches = matches && itemDate >= new Date((value as any).gte);
                  if ((value as any).lte) matches = matches && itemDate <= new Date((value as any).lte);
                  if ((value as any).gt) matches = matches && itemDate > new Date((value as any).gt);
                  if ((value as any).lt) matches = matches && itemDate < new Date((value as any).lt);
                  return matches;
                }

                // Handle OR (special case, usually at top level but simplified here)
                return true;
              });
            });

            // Handle top-level OR
            if (args.where.OR && Array.isArray(args.where.OR)) {
              // This is a bit complex for a simple mock, but let's try basic support
              // If we filtered by AND conditions above, we might have over-filtered if OR was present.
              // For now, let's assume OR is the main filter if present, or just ignore for simplicity if mixed.
              // Re-filtering from allItems for OR
              const orResults = args.where.OR.flatMap((condition: any) => {
                return allItems.filter((item: any) => {
                  return Object.entries(condition).every(([k, v]) => {
                    if ((v as any).contains) {
                      const itemVal = String(item[k] || '').toLowerCase();
                      const searchVal = String((v as any).contains).toLowerCase();
                      return itemVal.includes(searchVal);
                    }
                    return item[k] === v;
                  });
                });
              });
              // Merge and dedupe
              const existingIds = new Set(result.map((i: any) => i.id));
              orResults.forEach((item: any) => {
                if (!existingIds.has(item.id)) {
                  result.push(item);
                }
              });
            }
          }

          // Sorting
          if (args.orderBy) {
            const sortKeys = Array.isArray(args.orderBy) ? args.orderBy : [args.orderBy];
            sortKeys.forEach((sort: any) => {
              const [key, direction] = Object.entries(sort)[0] as [string, string];
              result.sort((a, b) => {
                if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
                return 0;
              });
            });
          }

          // Pagination
          if (args.skip !== undefined || args.take !== undefined) {
            const skip = args.skip || 0;
            const take = args.take || result.length;
            result = result.slice(skip, skip + take);
          }

          return result;
        },

        findUnique: async (args: any) => {
          const allItems = readData()[modelName] || [];
          if (!args.where) return null;

          return allItems.find((item: any) => {
            return Object.entries(args.where).every(([key, value]) => item[key] === value);
          }) || null;
        },

        count: async (args: any = {}) => {
          // Reuse findMany logic for filtering
          const filtered = await this[model].findMany(args);
          return filtered.length;
        },

        create: async (args: any) => {
          const currentData = readData();
          const list = currentData[modelName] || [];
          const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...args.data
          };
          list.push(newItem);
          currentData[modelName] = list;
          writeData(currentData);
          return newItem;
        },

        update: async (args: any) => {
          const currentData = readData();
          const list = currentData[modelName] || [];
          const index = list.findIndex((item: any) =>
            Object.entries(args.where).every(([k, v]) => item[k] === v)
          );

          if (index === -1) throw new Error('Record not found');

          const updatedItem = {
            ...list[index],
            ...args.data,
            updatedAt: new Date().toISOString()
          };
          list[index] = updatedItem;
          currentData[modelName] = list;
          writeData(currentData);
          return updatedItem;
        },

        delete: async (args: any) => {
          const currentData = readData();
          let list = currentData[modelName] || [];
          const initialLength = list.length;
          list = list.filter((item: any) =>
            !Object.entries(args.where).every(([k, v]) => item[k] === v)
          );

          if (list.length === initialLength) throw new Error('Record not found');

          currentData[modelName] = list;
          writeData(currentData);
          return { success: true };
        }
      };
    });
  }
}

export const prisma = new MockPrismaClient() as any;
