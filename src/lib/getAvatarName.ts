export const getAvatarName = (name : string)=>{
    const result = name?.split(" ")
    let dispaly = ""

    if(result?.length > 1){
        dispaly = `${result?.[0]?.[0]}${result?.[1]?.[0]}`
    }else{
        dispaly = result?.[0]?.[0]
    }

    return dispaly
}