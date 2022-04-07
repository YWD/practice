<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="$store.state.user" class="nav-item">
                <nuxt-link :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }" class="nav-link"
                 :class="{
                  active: tab === 'your_feed'
                 }"
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }" class="nav-link"
                           :class="{
                  active: tab === 'global_feed'
                 }"
                >Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag,
                    }
                  }" class="nav-link" :class="{
                  active: tab === 'tag'
                 }"
                >{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div v-for="article in articles" :key="article.slug" class="article-preview">
            <div class="article-meta">
              <nuxt-link :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }"
              >
                <img :src="article.author.image"/>
              </nuxt-link>
              <div class="info">
                <nuxt-link :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username
                    }
                  }" class="author"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date }}</span>
              </div>
              <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{
                    active: article.favorited
                  }"
                  @click="onFavorite(article)"
                  :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="{
              name: 'article',
              params: {
                slug: article.slug
              }
            }" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <nav>
            <ul class="pagination">
              <li v-for="item in totalPage"
                  :key="item"
                  class="page-item"
                  :class="{
                    active: item === page
                  }"
                  >
                    <nuxt-link
                        :to="{
                          name: 'home',
                          query: {
                            tab: tab,
                            tag: $route.query.tag,
                            page: item,
                          }
                        }"
                        class="page-link"
                    >{{ item }}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div v-for="tag in tags" :key="tag" class="tag-list">
              <nuxt-link :to="{
                name: 'home',
                query: {
                  tab: 'tag',
                  tag: tag,
                }
              }" class="tag-pill tag-default">{{ tag }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {addFavorite, deleteFavorite, getArticles, getFeedArticles} from "~/api/article";
import {getTags} from "@/api/tag";

export default {
  name: "HomePage",
  middleware: 'test',
  created() {
    console.log('home page created')
  },
  async asyncData(context) {
    console.log(context.store.state)
    const query = context.query
    console.log('name: "HomePage"')
    const { tag } = query
    const tab = query.tab || 'global_feed'
    const page = parseInt(query.page || 1)
    const limit = 20
    const loadArticles = tab === 'your_feed' && context.store.state.user
      ? getFeedArticles: getArticles

    try {
      const [ articlesRsp, tagRsp ] = await Promise.all([
        loadArticles({
          limit,
          offset: (page - 1) * limit,
          tag,
        }),
        getTags(),
      ])

      const { articles, articlesCount } = articlesRsp.data
      const { tags } = tagRsp.data
      articles.forEach(article => article.favoriteDisabled = false)
      return {
        articles,
        articlesCount,
        limit,
        page,
        tags,
        tag,
        tab: tab,
      }
    } catch (e) {
      console.log('error---------')
      console.log(e.response.statusText)
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    totalPage() {
      console.log('total page')
      console.log(this.articlesCount)
      console.log(this.limit)
      console.log(this.articlesCount / this.limit)
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true
      if (article.favorited) {
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

<style scoped>

</style>
