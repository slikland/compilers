# import slikland.core.App
# import slikland.utils.Prototypes
# import Erlik

class Embeded
	constructor:()->
		app.body = new BaseDOM({element: document.body})
		textarea = new BaseDOM({element: 'textarea'})
		textarea.html = '<div class="image erlik_plugin media-item" contenteditable="false" tabindex="0" data="%7B%22image%22%3A%22http%3A%2F%2Flocal.slikland.com%2Fs0.Slikland.Framework%2Fplugins%2Ferlik%2Fdeploy%2Fdynamic%2Fuploads%2F57aa30d97285a.png%22%2C%22sizes%22%3A%5B%7B%22id%22%3A%22destaque%22%2C%22size%22%3A%5B100%2C130%5D%2C%22bounds%22%3A%7B%22x%22%3A0.11538461538462%2C%22y%22%3A0%2C%22w%22%3A0.76923076923077%2C%22h%22%3A1%7D%2C%22url%22%3A%22http%3A%2F%2Flocal.slikland.com%2Fs0.Slikland.Framework%2Fplugins%2Ferlik%2Fdeploy%2Fdynamic%2Fcropped%2F57aa30d97285adestaque.png%22%7D%2C%7B%22id%22%3A%22destaque1%22%2C%22size%22%3A%5B250%2C200%5D%2C%22bounds%22%3A%7B%22x%22%3A0%2C%22y%22%3A0.1%2C%22w%22%3A1%2C%22h%22%3A0.8%7D%2C%22url%22%3A%22http%3A%2F%2Flocal.slikland.com%2Fs0.Slikland.Framework%2Fplugins%2Ferlik%2Fdeploy%2Fdynamic%2Fcropped%2F57aa30d97285adestaque1.png%22%7D%2C%7B%22id%22%3A%22destaue2%22%2C%22size%22%3A%5B500%2C500%5D%2C%22bounds%22%3A%7B%22x%22%3A0%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A1%7D%2C%22url%22%3A%22http%3A%2F%2Flocal.slikland.com%2Fs0.Slikland.Framework%2Fplugins%2Ferlik%2Fdeploy%2Fdynamic%2Fcropped%2F57aa30d97285adestaue2.png%22%7D%2C%7B%22id%22%3A%22destaue3%22%2C%22size%22%3A%5B100%2C100%5D%2C%22bounds%22%3A%7B%22x%22%3A0%2C%22y%22%3A0%2C%22w%22%3A1%2C%22h%22%3A1%7D%2C%22url%22%3A%22http%3A%2F%2Flocal.slikland.com%2Fs0.Slikland.Framework%2Fplugins%2Ferlik%2Fdeploy%2Fdynamic%2Fcropped%2F57aa30d97285adestaue3.png%22%7D%5D%7D"><img class="item" src="http://local.slikland.com/s0.Slikland.Framework/plugins/erlik/deploy/dynamic/cropped/57aa30d97285adestaque.png"><img class="item" src="http://local.slikland.com/s0.Slikland.Framework/plugins/erlik/deploy/dynamic/cropped/57aa30d97285adestaque1.png"><img class="item" src="http://local.slikland.com/s0.Slikland.Framework/plugins/erlik/deploy/dynamic/cropped/57aa30d97285adestaue2.png"><img class="item" src="http://local.slikland.com/s0.Slikland.Framework/plugins/erlik/deploy/dynamic/cropped/57aa30d97285adestaue3.png"></div>asd as das das da<b>asdasdas</b>asdasdasd'
		textarea.css({
			width: '800px'
		})
		app.body.appendChild(textarea)

		config = {
			toolbar: [
				# ['font']
				['bold', 'italic', 'underline', 'strikethrough', 'color']
				['undo', 'redo']
				['left', 'center', 'right', 'justify', 'indent', 'outdent']
				['superscript', 'subscript']
				['orderedlist', 'unorderedlist']
				['image', 'video', 'gallery']
				['customformat']
				['readmore', 'topics', 'blockcontent']
			]
			plugins: {
				CustomFormat: {
					label: "Formatação"
					items: [
						{
							'label': "&mdash;&mdash;&mdash;&mdash;&mdash;&mdash;"
							'tag': ''
						},
						{
							'label': "Titulo"
							'tag': 'h1'
						},
						{
							'label': "Test"
							'tag': 'div.test'
						}
					]
				}
			}
			fonts: [
				{
					name: "Some font"
					src: ""
					tags: ['a', 'b', 'i']
				}
				{
					name: "Some font"
					default: true
				}
			]
			image: {
				uploadService: "/api/image/upload"
				cropService: "/api/crop.php"
				type: "image/*"
				types: [
					{
						name: "Imagem destaque"
						id: "destaque"
						type: "image/*"
						size: [100, 130]
					}
					{
						name: "Mobile"
						id: "destaque1"
						type: "image/*"
						size: [250, 200]
					}
					{
						name: "Thumb"
						id: "destaue2"
						size: [500, 500]
					}
					{
						name: "Imagem destaque3"
						id: "destaue3"
						type: "image/*"
						size: [100, 100]
					}
				]
			}
		}

		@_erlik = new slikland.Erlik(textarea, config)
		# @_erlik.addFont('Some font')
		# @_erlik.addFonts([])


app.on('windowLoad', ->
	new Embeded()
)

