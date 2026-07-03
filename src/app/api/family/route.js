import { NextResponse } from 'next/server'
import { createReader } from '@keystatic/core/reader';
import  config from '../../../../keystatic.config.js';
// import config from '@keystatic/config';
export const dynamic = 'force-dynamic';
import fs from 'node:fs';
import path from 'node:path';

// const reader = createReader(process.cwd(), config);

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'content', 'people');

    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir)
      : [];

    console.log('cwd:', process.cwd());
    const reader = createReader(process.cwd(), config);
    const entries = await reader.collections.people.all();

    return NextResponse.json({
      files,
      entriesCount: entries.length,
      entries,
      // success: true,
      // entries,
      children: entries.map(({ slug, entry }) => ({
        // id: entry.id,
        id: Number(slug),
        name: entry.name,
        date: entry.birthDate,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
      success: false,
      error: error.message,
      },
      { status: 500 }
    );
  }
}