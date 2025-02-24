import { useCreateBlogStore } from "@/store";
import { Input, Label, Textarea, Button, Card, Badge } from "@/components/ui";
import { FiSave, FiEye, FiImage, FiTag } from "react-icons/fi";

const BasicInfoSettings = () => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    tags,
    tagInput,
    setTagInput,
    addTag,
    removeTag,
    featuredImage,
    setFeaturedImage,
    isPreview,
    togglePreview,
  } = useCreateBlogStore();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFeaturedImage(imageUrl);
    }
  };

  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Blog Post</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={togglePreview}>
            <FiEye className="mr-2" />
            {isPreview ? "Edit" : "Preview"}
          </Button>
          <Button>
            <FiSave className="mr-2" />
            Save Post
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <div className="space-y-6 p-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your blog post title"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description for SEO"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="featuredImage">Featured Image</Label>
            <div className="mt-1 flex items-center gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("imageInput")?.click()}
              >
                <FiImage className="mr-2" />
                Upload Image
              </Button>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {featuredImage && (
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="h-20 w-20 rounded object-cover"
                />
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="mt-1">
              <div className="mb-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type a tag and press Enter"
                />
                <Button
                  variant="outline"
                  className="w-max px-4"
                  onClick={addTag}
                >
                  <FiTag className="mr-2" />
                  Add Tag
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default BasicInfoSettings;