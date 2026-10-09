import { NextResponse } from 'next/server'
import { createReader } from '@keystatic/core/reader';
import  config from '../../../../keystatic.config.js';
export const dynamic = 'force-dynamic';
import fs from 'node:fs';
import path from 'node:path';

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'content', 'people');

    const files = fs.existsSync(dir)
      ? fs.readdirSync(dir)
      : [];

    const reader = createReader(process.cwd(), config);
    const entries = await reader.collections.people.all();

    return NextResponse.json({
      files,
      entriesCount: entries.length,
      entries,
      children: entries.map(({ slug, entry }) => ({
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