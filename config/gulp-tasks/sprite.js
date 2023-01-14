import svgSprite from "gulp-svg-sprite";
export const sprite = () => {
	return app.gulp.src(`${app.path.src.svgicons}`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "SVG",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: '../img/icons/icons.svg',
					//example: true
				}
			},
			shape: {
				id: {
					separator: '',
					generator: ''
				},
				transform: [{
					svgo: {
						plugins:
							[
								'removeXMLNS',
								'removeUselessStrokeAndFill',
								{
									name: "removeAttrs",
									params: {
										//attrs: '*:(stroke|fill):((?!^none$).)*'//delete fill except none
										attrs: '(fill|fill-rule|fill-opacity|clip-rule)'
									}
								},
								{
									name: 'preset-default',
									params: {
										overrides: {
											convertShapeToPath: false,
											moveGroupAttrsToElems: false
										}
									}
								},

								// or by expanded notation which allows to configure plugin
								{
									name: 'sortAttrs',
									params: {
										xmlnsOrder: 'alphabetical',
									},
								}
							]
					}
				}]
			},
			svg: {
				rootAttributes: {
					style: 'display: none;',
					'aria-hidden': true
				},
				xmlDeclaration: false
			}
		}))
		.pipe(app.gulp.dest(`${app.path.srcFolder}`));
}