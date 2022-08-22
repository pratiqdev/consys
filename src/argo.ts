const nestore = (store:Object = {}) => {
    
    const set = (path:string, value:any) => {
        var schema:any = store;  // a moving reference to internal objects within obj
        var pList:string[] = path.split('.');
        var len:number = pList.length;
        for(var i = 0; i < len-1; i++) {
            var elem = pList[i];
            if( !schema[elem] ) schema[elem] = {}
            schema = schema[elem];
        }
    
        schema[pList[len-1]] = value;
        return store
    }
    
    const get = (path:string) => {
        var schema:any = store;  // a moving reference to internal objects within obj
        var pList:string[] = path.split('.');
        var len:number = pList.length;
        for(var i = 0; i < len-1; i++) {
            var elem = pList[i];
            if( !schema[elem] ) schema[elem] = {}
            schema = schema[elem];
        }
    
        return schema[pList[len-1]]
    }

    return { get, set, store }
}
export default nestore