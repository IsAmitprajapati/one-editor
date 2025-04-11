export const getFileIcon = (extension : string)=>{
    switch(extension){
        case "html" : 
        return "/html.png"
        case "js" : 
        return "/js.png"
        case "css" : 
        return "/css.png"
        default :
         return "/unknown.png"
    }
}