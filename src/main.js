import Vue from 'vue'
import VueRes from 'vue-resource'
import { VueMasonryPlugin } from 'vue-masonry'

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
		addAD: function () {
			let data = {
				type: "add",
				content: this.newContent,
				title: this.newName
			}

			let reqSrt = "server.php?"

			for (var prop in data) {
				if (data.hasOwnProperty(prop)) {
					reqSrt += `${prop}=${data[prop]}&`
				}
			}

			this.$http.get(reqSrt).then(res => {
				console.log(res)
				if (typeof res.body == 'object') {
					this.ads.push(res.body)
					this.newContent = this.newName = ""
					this.$redrawVueMasonry()
				}
			})
		},
		remove: function (id) {
			let removed = this.ads.splice(id, 1)[0]

			let data = {
				type: "remove",
				id: removed.id
			}

			let reqSrt = "server.php?"

			for (var prop in data) {
				if (data.hasOwnProperty(prop)) {
					reqSrt += `${prop}=${data[prop]}&`
				}
			}

			this.$http.get(reqSrt).then(console.log)

			this.$redrawVueMasonry()
		}
	},
	created: function () {
		let refresh = () => {
			this.$http.get("server.php")
				.then(res => {
					this.ads = res.body
				})
		}


		refresh()
		setInterval(refresh, 7000)

		setTimeout(() => {
			this.$redrawVueMasonry()
		}, 300)
	}
})
