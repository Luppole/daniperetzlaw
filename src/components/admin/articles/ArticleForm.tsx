import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Loader2, Save, FileTextIcon, ImageIcon, EyeIcon } from 'lucide-react';
import { Article, getArticleById, createArticle, updateArticle } from '@/services/articleService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db, storage } from '@/integrations/firebase/client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';

const formSchema = z.object({
  title: z.string().min(3, 'הכותרת חייבת להיות לפחות 3 תווים'),
  summary: z.string().min(10, 'התקציר חייב להיות לפחות 10 תווים'),
  content: z.string().min(50, 'התוכן חייב להיות לפחות 50 תווים'),
  category: z.string().min(1, 'יש לבחור קטגוריה'),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Example markdown templates
const markdownTemplates = {
  basic: `# כותרת ראשית

## כותרת משנית

פסקה רגילה עם **טקסט מודגש** ו*טקסט נטוי*.

### רשימה

- פריט ראשון
- פריט שני
- פריט שלישי

> ציטוט חשוב מאוד.

[קישור לאתר](https://example.com)
`,
  legal: `# סקירה משפטית: זכויות וחובות

## רקע משפטי

פסקת פתיחה המסבירה את הנושא המשפטי...

## עיקרי החוק

### סעיף 1
תיאור הסעיף הראשון בחוק...

### סעיף 2
תיאור הסעיף השני בחוק...

## פסיקה רלוונטית

> "ציטוט מפסק דין חשוב" - כבוד השופת/ת X, תיק Y

## מסקנות והמלצות

1. המלצה ראשונה
2. המלצה שנייה
3. המלצה שלישית

---

*המידע אינו מהווה ייעוץ משפטי. יש להיוועץ בעורך דין לקבלת ייעוץ פרטני.*
`;

export function ArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ full_name?: string } | null>(null);
  const [previewTab, setPreviewTab] = useState<'edit' | 'preview'>('edit');
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const isEditing = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      category: '',
      image_url: '',
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as { full_name?: string });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const article = await getArticleById(id);
        if (article) {
          form.reset({
            title: article.title,
            summary: article.summary,
            content: article.content,
            category: article.category,
            image_url: article.image_url,
          });
          setImagePreview(article.image_url);
        } else {
          toast.error('המאמר לא נמצא');
          navigate('/admin/articles');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        toast.error('שגיאה בטעינת המאמר');
      } finally {
        setIsLoading(false);
      }
    };

    if (isEditing) {
      fetchArticle();
    }
  }, [id, navigate, form, isEditing]);

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('יש להתחבר תחילה');
      return;
    }

    setIsSaving(true);
    try {
      const authorName = userProfile?.full_name || user.displayName || user.email?.split('@')[0] || 'כותב לא ידוע';

      const articleData = {
        title: values.title,
        summary: values.summary,
        content: values.content,
        category: values.category,
        author: authorName,
        image_url: values.image_url || '',
      };

      if (isEditing && id) {
        await updateArticle(id, articleData);
        toast.success('המאמר עודכן בהצלחה');
      } else {
        await createArticle(articleData);
        toast.success('המאמר נוסף בהצלחה');
      }
      
      navigate('/admin/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('שגיאה בשמירת המאמר');
    } finally {
      setIsSaving(false);
    }
  };

  const applyTemplate = (templateKey: keyof typeof markdownTemplates) => {
    form.setValue('content', markdownTemplates[templateKey]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadError(null);
    
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('גודל הקובץ חייב להיות קטן מ-5MB');
      toast.error('גודל הקובץ חייב להיות קטן מ-5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setUploadError('יש להעלות קובץ תמונה בלבד');
      toast.error('יש להעלות קובץ תמונה בלבד');
      return;
    }
    
    setImageUploading(true);
    try {
      const timestamp = Date.now();
      const filename = `article-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      console.log('Uploading file:', filename);
      
      const storageRef = ref(storage, `article-images/${filename}`);
      
      const uploadResult = await uploadBytes(storageRef, file);
      console.log('File uploaded successfully:', uploadResult);
      
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Image download URL:', downloadURL);
      
      form.setValue('image_url', downloadURL);
      setImagePreview(downloadURL);
      
      toast.success('התמונה הועלתה בהצלחה');
    } catch (error: any) {
      console.error('Error uploading image to Firebase Storage:', error);
      setUploadError(`שגיאה בהעלאת התמונה: ${error.message || error}`);
      toast.error(`שגיאה בהעלאת התמונה: ${error.message || error}`);
    } finally {
      setImageUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-law-navy" />
      </div>
    );
  }

  const currentContent = form.watch('content');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/admin/articles')}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold text-law-navy">
            {isEditing ? 'עריכת מאמר' : 'מאמר חדש'}
          </h2>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>כותרת</FormLabel>
                        <FormControl>
                          <Input placeholder="הזן כותרת למאמר" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>תקציר</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="הזן תקציר למאמר" 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>קטגוריה</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר קטגוריה" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="דיני משפחה">דיני משפחה</SelectItem>
                            <SelectItem value="דיני עבודה">דיני עבודה</SelectItem>
                            <SelectItem value="נדל״ן">נדל״ן</SelectItem>
                            <SelectItem value="ליטיגציה">ליטיגציה</SelectItem>
                            <SelectItem value="מסחרי">מסחרי</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <FormItem>
                    <FormLabel>תמונת מאמר</FormLabel>
                    <div className="flex flex-col gap-4">
                      {imagePreview && (
                        <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="תצוגה מקדימה" 
                            className="w-full h-full object-cover"
                            onError={() => {
                              toast.error('שגיאה בטעינת התמונה');
                              setImagePreview(null);
                            }}
                          />
                        </div>
                      )}
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={imageUploading}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-law-navy file:text-white hover:file:bg-law-navy/90"
                          />
                          {imageUploading && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              מעלה תמונה...
                            </div>
                          )}
                          {uploadError && (
                            <div className="text-red-500 text-sm">{uploadError}</div>
                          )}
                        </div>
                      </FormControl>
                    </div>
                  </FormItem>
                  
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <FormLabel>תוכן המאמר (Markdown)</FormLabel>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyTemplate('basic')}
                    >
                      <FileTextIcon className="h-4 w-4 ml-2" />
                      תבנית בסיסית
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyTemplate('legal')}
                    >
                      <FileTextIcon className="h-4 w-4 ml-2" />
                      תבנית משפטית
                    </Button>
                  </div>
                </div>
                
                <Tabs defaultValue="edit" onValueChange={(value) => setPreviewTab(value as 'edit' | 'preview')}>
                  <TabsList className="mb-2">
                    <TabsTrigger value="edit" className="flex items-center gap-1">
                      <FileTextIcon className="h-4 w-4" />
                      עריכה
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      תצוגה מקדימה
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="edit">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="הזן את תוכן המאמר (markdown)" 
                              className="min-h-[300px] font-mono text-base"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    <div className="border rounded-md p-4 min-h-[300px] bg-white overflow-auto">
                      <div className="prose prose-lg max-w-none">
                        <ReactMarkdown>
                          {currentContent || 'אין תוכן להצגה'}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/articles')}
                  disabled={isSaving}
                >
                  ביטול
                </Button>
                <Button 
                  type="submit" 
                  className="bg-law-navy hover:bg-law-navy/90"
                  disabled={isSaving || imageUploading}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      שומר...
                    </>
                  ) : (
                    <>
                      <Save className="ml-2 h-4 w-4" />
                      {isEditing ? 'עדכן מאמר' : 'פרסם מאמר'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
