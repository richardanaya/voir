class Router {
  routes = [];
  root = '/';

  constructor(options) {
    window.addEventListener("load",()=>{
      this.listen();
      this.routeCheck();
    })
  }

  add(path, cb) {
    this.routes.push({ path, cb });
  }

  clearSlashes(path){
    return path.toString()
    .replace(/\/$/, '')
    .replace(/^\//, '');
  }

  getCurrentPath() {
    let fragment = (decodeURI(window.location.pathname + window.location.search));
    fragment = fragment.replace(/\?(.*)$/, '');
    return (fragment)
  };

  navigate(path) {
    window.history.pushState(null, null, this.root + this.clearSlashes(path));
  };

  isExternal(path){
    return path.indexOf(window.location.origin) != 0;
  }

  listen() {
    this.interval = setInterval(this.routeCheck.bind(this), 50);
  };

  routeCheck(){
    let curPath = this.getCurrentPath();
    if (this.current === curPath) return;
    this.current = curPath;

    this.routes.some(route => {
      const match = this.current.match(route.path);
      if (match) {
        match.shift();
        route.cb.call(null,match)
        return match;
      }
      return false;
    });
  };
}

const router = new Router();

let currentPageRoute = null;

export class PageRoute {
  constructor(route){
    this.firstTime = false;
    this.router = router;
    this.router.add(route,(match)=>{
      currentPageRoute = this;
      this.match = match;
      if(this.onInit && !this.firstTime){
        spawn(this.onInit.bind(this));
        this.firstTime = true;
      }
      if(this.onLoad){
        spawn(this.onLoad.bind(this));
      }
      if(this.onRender){
        spawn(this.onRender.bind(this))
      }
    })
  }

  renderCurrentPage() {
    if(currentPageRoute && currentPageRoute.onRender){
      currentPageRoute.onRender();
    }
  }

  navigate(path){
    router.navigate(path);
  }
}

export function register(routes){
  for(var i in routes){
    new routes[i];
  }
}

export function spawn(f){
  f().then(()=>{
      //executed
  })
}

document.addEventListener("click",function(e){
  var el = e.target;
  while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
  if (!el || 'A' !== el.nodeName.toUpperCase()) return;
  if(el && !router.isExternal(el.href)){
    router.navigate(el.href.slice(window.location.origin.length))
    e.preventDefault();
  }
})