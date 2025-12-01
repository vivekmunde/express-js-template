import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

const PRISMA_SCHEMA_DIR = join(__dirname, '../schema');
const BASE_SCHEMA_FILE = 'base.prisma';
const TARGET_SCHEMA_PATH = join(__dirname, '../prisma/schema.prisma');

try {
  // Ensure target directory exists
  const targetDir = dirname(TARGET_SCHEMA_PATH);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  // Get all .prisma files from the directory
  const schemaFiles = readdirSync(PRISMA_SCHEMA_DIR)
    .filter((file) => file.endsWith('.prisma'))
    .sort((a, b) => {
      // Ensure schema.prisma comes first
      if (a === BASE_SCHEMA_FILE) return -1;
      if (b === BASE_SCHEMA_FILE) return 1;
      return a.localeCompare(b);
    });

  if (!schemaFiles.includes(BASE_SCHEMA_FILE)) {
    throw new Error(`Base schema file '${BASE_SCHEMA_FILE}' not found in ${PRISMA_SCHEMA_DIR}`);
  }

  // Read and merge all schema files
  const mergedValidationSchema = schemaFiles
    .map((file) => {
      const content = readFileSync(join(PRISMA_SCHEMA_DIR, file), 'utf8').trim();
      return content;
    })
    .join('\n\n');

  // Write merged schema to target file
  writeFileSync(TARGET_SCHEMA_PATH, mergedValidationSchema, 'utf8');
} catch (error) {
  console.error('Error while merging schema files:', error);
  process.exit(1);
}
