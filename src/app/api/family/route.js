import { NextResponse } from 'next/server'
import { createReader } from '@keystatic/core/reader';
import  config from '../../../../keystatic.config.js';
export const dynamic = 'force-dynamic';

// const reader = createReader(process.cwd(), config);

export async function GET() {
  return new Response('HELLO FROM API');

  // try {
  //   console.log('cwd:', process.cwd());
  //   const reader = createReader(process.cwd(), config);
  //   const entries = await reader.collections.people.all();

  //   return NextResponse.json({
  //     // success: true,
  //     // entries,
  //     children: entries.map(({ entry }) => ({
  //       id: entry.id,
  //       name: entry.name,
  //       date: entry.birthDate,
  //     })),
  //   });
  // } catch (error) {
  //   return NextResponse.json(
  //     {
  //     success: false,
  //     error: error.message,
  //     },
  //     { status: 500 }
  //   );
  // }
}