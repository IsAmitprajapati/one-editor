'use client'
import React, { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Axios from '@/lib/Axios'
import { toast } from 'sonner'
import Image from 'next/image'
import CreateProject from './_component/CreateProject'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

const Dashboardpage = () => {
  const [data,setData] = useState<any[]>([])
  const [isLoading,setIsLoading] = useState(true)
  const [page,setPage] = useState(1)
  const [totalPage,setTotalPage] = useState(1)
  const router = useRouter()

  const fetchData = async()=>{
    try {
      setIsLoading(true)
      const response = await Axios({
        url : "/api/project",
        params : {
          page : page
        }
      })

      if(response.status === 200){
          setData(response.data.data || [])
          setTotalPage(response.data.totalPages)
      }

    } catch (error : any) {
      toast.error(error?.response?.data?.error)
    } finally{
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    fetchData()
  },[page])

  const handleRedirectEditorpage = (projectId : string)=>{
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/editor/${projectId}?file=index.html`)
  }

  return (
    <div>
      {
        isLoading ? (
          <p className='my-4 w-fit mx-auto'>Loading...</p>
        ) : (
          !(Array.isArray(data) && data.length > 0) ? (
            <div className='flex justify-center items-center flex-col min-h-[calc(100vh-3.5rem)]'>
              <Image
                src={"/project.svg"}
                width={300}
                height={300}
                alt='Create project'
              />
              <p className='text-gray-500 my-4'>Create project effortlessly with our intuitive editor. </p>
              <CreateProject buttonVarient='default'/>
            </div>
          ) : (
            <div className='grid gap-6 lg:grid-cols-2 p-4 lg:p-6'>
              {
                data.map((item,index)=>{
                  return(
                    <Card onClick={()=>handleRedirectEditorpage(item?._id)} key={item?._id} className='cursor-pointer overflow-hidden group max-h-60'>
                        <CardHeader>
                          <CardTitle>{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='border rounded-lg min-h-60 overflow-hidden  top-15 group-hover:top-4 transition-all relative shadow drop-shadow-2xl'>
                                <iframe
                                  className='w-full h-full'
                                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/file/${item._id}/index.html`}
                                />
                            </div>
                        </CardContent>
                    </Card>
                  )
                })
              }
            </div>
          )
        )
      }
    </div>
  )
}

export default Dashboardpage
