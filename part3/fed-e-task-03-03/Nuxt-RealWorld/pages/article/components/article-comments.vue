<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="$store.state.user.image" class="comment-author-img"/>
        <button class="btn btn-sm btn-primary">
          Post Comment
        </button>
      </div>
    </form>

    <div v-for="comment in comments" :key="comment.id" class="card">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
            :to="{
              name: 'profile',
              params: {
                username: comment.author.username
              }
            }"
            class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img"/>
        </nuxt-link>
        &nbsp;
        <nuxt-link
            :to="{
              name: 'profile',
              params: {
                username: comment.author.username
              }
            }"
            class="comment-author"
        >
          {{ comment.author.username }}
        </nuxt-link>
        &nbsp;
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY')}}</span>
      </div>
    </div>

  </div>
</template>

<script>
import {getComments} from "@/api/article";

export default {
  name: "article-comments",
  props: {
    article: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      comments: [],
    }
  },
  async mounted() {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },
}
</script>

<style scoped>

</style>
