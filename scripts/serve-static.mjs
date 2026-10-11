// Local verification server for the generated static output (not a production server).
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve('dist');
const aliases={'/services/full-stack-web-development':'/web-development','/services/wordpress-development':'/web-development','/services/full-stack':'/web-development','/services/wordpress':'/web-development','/services/branding-identity':'/services/graphic-design','/services/branding':'/services/graphic-design','/services/digital-marketing':'/services/graphic-design'};
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.xml':'application/xml','.txt':'text/plain'};
createServer(async(req,res)=>{
 const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(aliases[path]){res.writeHead(301,{Location:aliases[path]});return res.end();}
 let file=resolve(root,'.'+path);if(!file.startsWith(root+'/')&&file!==root){res.writeHead(403);return res.end();}
 try {if((await stat(file)).isDirectory())file+='/index.html';const body=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'});res.end(body);}
 catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(root+'/404.html'));}
}).listen(4173,'127.0.0.1',()=>console.log('Static output at http://127.0.0.1:4173'));
