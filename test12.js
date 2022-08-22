let obj = {alpha:{beta:{charlie: 'tango', echo: 'foxtrot'}}}

const key = 'alpha.beta.charlie'
const value = 'delta'

// let refs = []

// obj = {};  // global object

const argo = (store = {}) => {
    
    const set = (path, value) => {
        var schema = store;  // a moving reference to internal objects within obj
        var pList = path.split('.');
        var len = pList.length;
        for(var i = 0; i < len-1; i++) {
            var elem = pList[i];
            if( !schema[elem] ) schema[elem] = {}
            schema = schema[elem];
        }
    
        schema[pList[len-1]] = value;
        return store
    }
    
    const get = (path) => {
        var schema = store;  // a moving reference to internal objects within obj
        var pList = path.split('.');
        var len = pList.length;
        for(var i = 0; i < len-1; i++) {
            var elem = pList[i];
            if( !schema[elem] ) schema[elem] = {}
            schema = schema[elem];
        }
    
        return schema[pList[len-1]]
    }

    return { get, set, store }
}

const {get, set, store} = argo(obj)


console.log(set(key, value))
console.log(get(key))
console.log(get('flap'))
console.log(store)

// keys.forEach(key => {
//     // if(!(key in obj)){
//         obj[key] = {}
//         // obj = {...obj[key]}
//     // }

// })
