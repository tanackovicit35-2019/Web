import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from '../post.model';
import { PostsService } from "../posts.service";
import { Subscription } from "rxjs";


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
 /* posts=[{title:"Prvi naslov",content:"ysduwhsbiucnse",picture:"https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg"},
{title:"Drugi naslov",content:"vsudvcdubhs",picture:"https://static.toiimg.com/thumb/msid-53891743,width-748,height-499,resizemode=4,imgsize-152022/.jpg"},]
*/
posts: Post[]=[];
private postsSub: Subscription = new Subscription;

constructor(public postsService:PostsService) {}
ngOnInit() {
  this.postsService.getPosts();
  this.postsSub=this.postsService.getPostsUpdateListener().subscribe((posts:Post[])=>{this.posts=posts;});
}

onDelete(postId: string){
  this.postsService.deletePost(postId);
}

ngOnDestroy(){
  this.postsSub.unsubscribe();
}
}
