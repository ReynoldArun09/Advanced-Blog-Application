import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePostMutation } from "@/services/mutations";
import { X } from "lucide-react";
import { useState } from "react";


export default function CreatePostPage() {
  const [title, setTitle] = useState<string>('')
  const [desc, setDesc] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([])

  const {mutate: createPost} = useCreatePostMutation()


  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
  }


  const handleAddCategories = () => {
     if(!category) return
     const oldCategories = [...categories]
     oldCategories.push(category)
     setCategories(oldCategories)
     setCategory('')
  }

  const handleDeleteCategory = (index:number) => {
    const oldCategories = [...categories]
    oldCategories.splice(index, 1)
    setCategories(oldCategories)
  }

  const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createPost({title, desc, image, categories})
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold underline tracking-wider">Create Post</h1>
        <form className="w-1/2 space-y-5" onSubmit={handlePostSubmit}>
            <div className="space-y-3">
                <Label>Title</Label>
                <Input placeholder="enter your post title..." value={title} onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <div className="space-y-3">
                <Label>Select Your Image</Label>
                <Input type="file" onChange={handleChangeImage}/>
                {image && <img src={image} alt="image" className="w-full h-40 object-cover"/>}
            </div>
            <div className="space-y-3">
                <Label>Categories</Label>
                <div className="flex gap-4">
                    <Input placeholder="add categories/tags..." value={category} onChange={(e) => setCategory(e.target.value)}/>
                    <Button type="button" onClick={handleAddCategories}>Add Categories</Button>
                </div>
            </div>
            <div className="space-x-3 flex items-center">
                {categories.map((category, index:number) => (
                    <div key={index} className="flex gap-2 items-center">
                        <Badge className="capitalize tracking-wider text-md">{category}</Badge>
                        <X className="cursor-pointer" onClick={() => handleDeleteCategory(index)}/>
                    </div>
                ))}
            </div>
            <div className="space-y-3">
                <Label>Descriptons</Label>
                <Textarea placeholder="write your description here" value={desc} onChange={(e) => setDesc(e.target.value)}/>
            </div>
            <Button type="submit" size={'lg'} className="font-bold tracking-wide">Submit</Button>
        </form>
    </section>
  )
}
