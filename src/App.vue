<template lang="pug">
#app
  #nav
    router-link(to="/") 출석체크
    router-link(to="/point") 포인트현황
  router-view
</template>

<style lang="stylus">
#app
	font-family 'Avenir', Helvetica, Arial, sans-serif
	-webkit-font-smoothing antialiased
	-moz-osx-font-smoothing grayscale
	text-align center
	color #2c3e50
#nav
	padding 10px
	a
		margin 0 10px
		font-weight bold
		color #2c3e50
		&.router-link-exact-active 
			color #42b983	
</style>
