import Vue from 'vue'
import VueRes from 'vue-resource'
import { VueMasonryPlugin } from 'vue-masonry'
import { markdown } from 'markdown'
import decodeHtml from 'decode-html'

Vue.use( VueRes );
Vue.use( VueMasonryPlugin )




let main = new Vue({
	el: ".main",
	data: {
		newName: "",
		newContent: "",
		ads: []
	},
	methods: {
		sendApiReq (data) {

			let reqSrt = "server.php?"

			for (var prop in data) {
				if (data.hasOwnProperty(prop)) {
					reqSrt += `${prop}=${data[prop]}&`
				}
			}

			return this.$http.get(reqSrt)
		},
		addAD: function () {
			let data = {
				type: "add",
				content: this.newContent,
				title: this.newName
			}

			this.sendApiReq(data).then(res => {
				this.refresh()
				this.newContent = this.newName = ""
			})
		},
		remove: function (id) {
			let removed = this.ads.splice(id, 1)[0]

			let data = {
				type: "remove",
				id: removed.id
			}

			this.sendApiReq(data).then(console.log)
		},
		edit (index) {
			this.ads[index].edit = true
			setTimeout(() => {
				this.$redrawVueMasonry()
			}, 250)
		},
		cancelEdit (index) {
			this.ads[index].edit = false
			setTimeout(() => {
				this.$redrawVueMasonry()
			}, 250)
		},
		save (index) {
			let data = {
				type: "update",
				id: this.ads[index].id,
				content: this.ads[index].editFields.content,
				title: this.ads[index].editFields.title
			}

			this.sendApiReq(data).then(res => {
				this.ads[index].edit = false
				this.ads[index].content = markdown.toHTML( data.content  )
				this.ads[index].title = data.title
				setTimeout(() => {
					this.$redrawVueMasonry()
				}, 250)
			})
		},
		pushAd(ad) {
			this.ads.push({
					edit: false,
					editFields: ad,
					content: ad.content ? markdown.toHTML( ad.content ) : "",
					id: ad.id,
					title: ad.title
			})
		},
		refresh() {
			this.$http.get("server.php")
				.then(res => {

					console.log( res )

					this.ads.forEach((adL, index) => {
						if (!res.body.find(ad => adL.id == ad.id)) this.ads.splice(index, 1)
					})

					res.body.forEach(ad => {
						if (!this.ads.find(adL => adL.id == ad.id)) this.pushAd(ad)
					})
				})
				.catch(err => {
					console.error(err)
				})
		}
	},
	watch: {
		ads () {
			this.$redrawVueMasonry()
			setTimeout(() => {
				this.$redrawVueMasonry()
			}, 250)
		}
	},
	created: function () {
		this.refresh()
		setInterval(() => {
			this.refresh()
		}, 7000)
	}
})
