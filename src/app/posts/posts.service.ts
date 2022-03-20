import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn:'root'})
export class PostsService{
  private posts: Post[]=[];
  private postsUpdated=new Subject<Post[]>();

  constructor (private http: HttpClient) {}

  getPosts(){
    this.http
    .get<{message:string,posts:any}>('http://localhost:3000/api/posts')
    .pipe(map((postData)=>{
      return postData.posts.map((post: { title: any; content: any; picture: any; _id: any; }) => {
        return{
          title: post.title,
          content: post.content,
          picture: post.picture,
          id: post._id
        }
      })
    }))
    .subscribe(transformedPosts=>{this.posts=transformedPosts; this.postsUpdated.next([...this.posts]);});
  }

  getPostsUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  /**getPost(id:string){
    return{...this.posts.find(p=>p.id===id)};
  }*/

  addPost(title:string,content:string,picture:any){
    const post: Post={id:null,title:title,content:content,picture:picture};
    this.http.post<{message:string, postId: string}>("http://localhost:3000/api/posts",post)
    .subscribe((responseData)=>{
      const id = responseData.postId;
      post.id=id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }

  deletePost(postId: string){
    this.http.delete("http://localhost:3000/api/posts" + postId)
    .subscribe(()=>{
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts=updatedPosts;
      this.postsUpdated.next([...this.posts]);
    })
  }
}
