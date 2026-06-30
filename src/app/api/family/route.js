import { NextResponse } from 'next/server'
import { createReader } from '@keystatic/core/reader';
import  config from '../../../../keystatic.config.js';

import fs from 'node:fs';
import path from 'node:path';

const reader = createReader(process.cwd(), config);

export async function GET() {
  try {

    const dir = path.join(process.cwd(), 'content', 'people');

    console.log('cwd =', process.cwd());
    console.log('dir =', dir);
    console.log('dir exists =', fs.existsSync(dir));

    if (fs.existsSync(dir)) {
      console.log('files =', fs.readdirSync(dir));
    }

    if (fs.existsSync(dir)) {
      console.log('files =', fs.readdirSync(dir));

      // Посмотрим содержимое первого файла
      const files = fs.readdirSync(dir);
      if (files.length > 0) {
        const first = path.join(dir, files[0]);
        console.log('first file =', first);
        console.log('content =\n', fs.readFileSync(first, 'utf8'));
      }
    }

    const entries = await reader.collections.people.all();

    console.log('entries =', entries.length);
    console.log(entries);


    return NextResponse.json({
      // success: true,
      // entries,
      children: entries.map(({ entry }) => ({
        id: entry.id,
        name: entry.name,
        date: entry.birthDate,
      })),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
      success: false,
      error: error.message,
      },
      { status: 500 }
    );
  }
}