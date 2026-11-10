// Run after replacing the authorized PNG captures. Originals are never modified.
import sharp from 'sharp';
import {mkdirSync,statSync} from 'node:fs';
mkdirSync('public/screenshots/optimized',{recursive:true});
for(const name of ['home','messages','calls','settings','midnight','cyber']){
  const source=`public/screenshots/nexus-${name}.png`;
  const desktop=`public/screenshots/optimized/nexus-${name}-1920.webp`;
  const mobile=`public/screenshots/optimized/nexus-${name}-960.webp`;
  const metadata=await sharp(source).metadata();
  if(metadata.width!==1920||metadata.height!==1045)throw new Error(`${source}: revise dimensões e configuração antes de gerar derivados.`);
  await sharp(source).webp({lossless:true,effort:6}).toFile(desktop);
  await sharp(source).resize({width:960}).webp({quality:92,effort:6}).toFile(mobile);
  console.log(`${name}: PNG ${statSync(source).size} B → WebP ${statSync(desktop).size} B / mobile ${statSync(mobile).size} B`);
}
