<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">

        <h1>{{ article.title }}</h1>
        <article-meta :article="article"></article-meta>
      </div>

    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.body">
        </div>
      </div>

      <hr/>

      <div class="article-actions">
        <article-meta :article="article"></article-meta>
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

          <article-comments :article="article"></article-comments>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
import {articleDetail} from "@/api/article";
import MarkdownIt from 'markdown-it'
import ArticleMeta from "@/pages/article/components/article-meta";
import ArticleComments from "@/pages/article/components/article-comments";
export default {
  name: "ArticleIndex",
  components: {
    ArticleComments,
    ArticleMeta,
  },
  async asyncData({ params }) {
    const { data } = await articleDetail(params.slug)
    const markDownIt = new MarkdownIt()
    const { article } = data
    article.body = markDownIt.render(article.body)
    return {
      article,
    }
  },
  head () {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        { hid: 'description', name: 'description', content: this.article.description }
      ]
    }
  }
}
</script>

<style scoped>

</style>
