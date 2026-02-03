export class LRUCache {
  constructor(size){this.size=size;this.cache=new Map();}
  access(key){
    if(this.cache.has(key)){
      this.cacheHits++;
      const val=this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key,val);
      return val;
    }else{
      if(this.cache.size>=this.size) this.cache.delete(this.cache.keys().next().value);
      this.cache.set(key,true);
      return null;
    }
  }
}