const http=require('http'),fs=require('fs'),path=require('path'),url=require('url');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.webmanifest':'application/manifest+json'};
http.createServer(async(req,res)=>{
 const u=url.parse(req.url,true);
 if(u.pathname.startsWith('/api/')){
  let h;try{h=require(root+u.pathname.replace(/\/$/,'').replace(/[^a-z\/_-]/gi,'')+'.js')}catch(e){res.statusCode=404;return res.end('nf')}
  const r={setHeader:(k,v)=>res.setHeader(k,v),status(c){res.statusCode=c;return this},json(o){res.setHeader('content-type','application/json');res.end(JSON.stringify(o))}};
  try{return await h({query:u.query},r)}catch(e){res.statusCode=500;return res.end('error')}
 }
 // Mirrors vercel.json: /docs -> docs.html, clean URLs, 404.html for unknown paths.
 const clean=u.pathname==='/docs'?'/docs.html':u.pathname==='/'?'/index.html':u.pathname;
 const isFile=f=>fs.existsSync(f)&&fs.statSync(f).isFile();
 let f=path.join(root,clean); if(!isFile(f)&&isFile(f+'.html'))f+='.html';
 if(!f.startsWith(root)||!isFile(f)){res.statusCode=404;res.setHeader('content-type','text/html');return res.end(fs.readFileSync(path.join(root,'404.html')))}
 res.setHeader('content-type',types[path.extname(f)]||'text/plain');res.end(fs.readFileSync(f));
}).listen(process.env.PORT||3000,()=>console.log('Dev server: http://localhost:'+(process.env.PORT||3000)+'  (static files + /api, same as Vercel)'));
