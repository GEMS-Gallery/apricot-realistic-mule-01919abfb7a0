import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Time "mo:base/Time";
import List "mo:base/List";
import Debug "mo:base/Debug";

actor {
  public type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  stable var nextId: Nat = 0;
  stable var posts: List.List<Post> = List.nil();

  public query func getPosts(): async [Post] {
    List.toArray(posts)
  };

  public func createPost(title: Text, body: Text, author: Text): async () {
    let post: Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := List.push(post, posts);
    nextId += 1;
    Debug.print("New post created: " # title);
  };
}
