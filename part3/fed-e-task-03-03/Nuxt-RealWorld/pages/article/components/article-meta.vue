<template>
  <div class="article-meta">
    <a href=""><img src="http://i.imgur.com/Qr71crq.jpg"/></a>
    <div class="info">
      <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: article.author.username
            }
          }"
          class="author"
      >{{ article.author.username }}</nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
    <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following
        }"
    >
      <i class="ion-plus-round"></i>
      &nbsp;
      Follow Eric Simons <span class="counter">({{ article.favoritesCount }})</span>
    </button>
    &nbsp;&nbsp;
    <button
        class="btn btn-sm"
        :class="{
          'btn-outline-primary': true
        }"
    >
      <i class="ion-heart"></i>
      &nbsp;
      Favorite Post <span class="counter">(29)</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "article-meta",
  props: {
    article: {
      type: Object,
      required: true,
    }
  }
}
</script>

<style scoped>

</style>
