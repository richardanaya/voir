class Router {
  routes = [];
  root = '/';

  constructor(options) {
    window.addEventListener("load",()=>{
      this.listen();
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
    let fragment = this.clearSlashes(decodeURI(window.location.pathname + window.location.search));
    fragment = fragment.replace(/\?(.*)$/, '');
    return this.clearSlashes(fragment)
  };

  navigate(path) {
    window.history.pushState(null, null, this.root + this.clearSlashes(path));
  };

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
        spawn(this.onInit);
        this.firstTime = true;
      }
      if(this.onLoad){
        spawn(this.onLoad);
      }
      if(this.onRender){
        spawn(this.onRender)
      }
    })
  }

  renderCurrentPage() {
    if(currentPageRoute && currentPageRoute.onRender){
      currentPageRoute.onRender();
    }
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