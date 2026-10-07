const http=require('http'),fs=require('fs'),path=require('path'),url=require('url');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.webmanifest':'application/manifest+json'};
http.createServer(async(req,res)=>{
 const u=url.parse(req.url,true);
 if(u.pathname.startsWith('/api/')){
  const h=require(root+u.pathname.replace(/\/$/,'')+'.js');
  const r={setHeader:(k,v)=>res.setHeader(k,v),status(c){res.statusCode=c;return this},json(o){res.setHeader('content-type','application/json');res.end(JSON.stringify(o))}};
  return h({query:u.query},r);
 }
 let f=path.join(root,u.pathname==='/'?'index.html':u.pathname); if(!fs.existsSync(f)&&fs.existsSync(f+'.html'))f+='.html';
 if(!fs.existsSync(f)){res.statusCode=404;return res.end('nf')}
 res.setHeader('content-type',types[path.extname(f)]||'text/plain');res.end(fs.readFileSync(f));
}).listen(process.env.PORT||3000,()=>console.log('Dev server: http://localhost:'+(process.env.PORT||3000)+'  (static files + /api, same as Vercel)'));
