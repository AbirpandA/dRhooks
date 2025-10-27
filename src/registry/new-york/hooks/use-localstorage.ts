import React from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
const [value,setValue]=React.useState<T>(()=>{
    if(typeof window=='undefined'){
        console.log(`useLocalStorage: Attempted to access localStorage on server for key: "${key}". Returning initialValue.`)
        return initialValue
    }
    try{
        const item= window.localStorage.getItem(key)
        return item? JSON.parse(item) : initialValue
    }catch(err){
        console.log(`useLocalStorage: Failed to read from localStorage for key: "${key}"`, err)
        return initialValue
    }

    
})




React.useEffect(() => {
     try{
        if(value===undefined || value===null){
            window.localStorage.removeItem(key)
            console.info(`useLocalStorage: Removed item from localStorage for key: "${key}"`)
        }else{

            window.localStorage.setItem(key,JSON.stringify(value)) 
        }
    }catch(err){
        console.log(`useLocalStorage: Failed to write to localStorage for key: "${key}"`, 'Value:', value, 'Error:', err)
    }
}, [key,value])

return [value,setValue]
}