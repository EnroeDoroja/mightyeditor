MT.extend("core.Emitter").extend("core.BasicPlugin")(
	MT.plugins.Export = function(project){
		MT.core.BasicPlugin.call(this, "Export");
		this.project = project;
	},
	{
		initUI: function(ui){
			var that = this;
			this.list = new MT.ui.List([
				{
					label: "Phaser.io (.js)",
					title: "Phaser.io Project",
					className: "",
					cb: function () {
						that.export("phaser", function (data) {
							window.location = that.project.path + "/" + data.file;
						});
					}
				},
				{
                    label: "Web App (Phaser.io minified)",
					title: "Minified project sources based on Phaser.io framework",
                    className: "",
                    cb: function () {
						that.minify();
                    }
				},
				{
					label: "data only - js",
					title: "data generated by editor - javascript format",
					className: "",
					cb: function () {
						that.export("phaserDataOnly", function (data) {
							that.openDataLink(data, "js");
						});
					}
				},
				{
					label: "data only - json",
					title: "data generated by editor - JSON format",
					className: "",
					cb: function () {
						that.export("phaserDataOnly", function (data) {
							that.openDataLink(data, "json");
						});
					}
				}
				], ui, true);

			var b = this.button= this.project.panel.addButton("Export", null, function(e){
				that.showList();
			});
			var om = this.project.plugins.objectmanager;

			this.openGame = this.project.panel.addButton("Open Game", null, function(e){
				om.sync();
				that.openLink("_open_game");
			});

		},

		export: function(dest, data, cb){
			if(typeof data == "function"){
				cb = data;
				data = null;
			}
			this.send(dest, data);
			this.once("done", cb);
		},

		showList: function(){
			this.list.width = 250;
			this.list.y = this.button.el.offsetHeight;
			this.list.x = this.button.el.offsetLeft-5;
			this.list.el.style.bottom = "initial";
			this.list.show(document.body);
		},

		openDataLink: function(data, json){
			if(json == "json"){
				data.file += "on";
			}
			var w = window.innerWidth*0.5;
			var h = window.innerHeight*0.8;
			var l = (window.innerWidth - w)*0.5;
			var t = (window.innerHeight - h)*0.5;

			window.open(this.project.path + "/" + data.file,"","width="+w+",height="+h+",left="+l+",top="+t+"");
		},

		openLink: function(name){
			var w = window.open("about:blank",name || Date.now());
			w.focus();
			//w.opener = null;

			var path = this.project.path;
			this.export("phaser", function(data){
				if(w.location){
					w.location.href = path + "/" +data.name + "/index.html";
					w.focus();
				}
			});

		},
		
		minify: function(){
			var that = this;
			var label = "Export in progress";
			var dots = "...";
			var pop = new MT.ui.Popup("Export", label + dots);
			
			var interval = window.setInterval(function(){
				dots += ".";
				if(dots.length > 3){
					dots = "";
				}
				pop.content.innerHTML = label + dots;
			}, 100);
			
			
			
			this.export("phaserMinify", function (data) {
				window.clearInterval(interval);
				pop.showClose();
				pop.addButton("Done", function(){pop.hide();});
				
				var base = window.location.origin + "/" + that.project.path + "/" + data.file;
				
				var link = base + "-minified/index.html";
				
				pop.content.innerHTML = '<div class="table">'+
					'<a href="' + link + '" style="width: 90px" target="_blank">Open</a> <div><input value="'+link+'"  style="padding: 3px; width: 100%"/></div>';
				link = base + '.min.zip';
				pop.content.innerHTML += '<div class="table">'+
					'<a href="' + link + '" style="width: 90px" target="_blank">Download</a> <div><input value="'+link+'"  style="padding: 3px; width: 100%"/></div>';
			});
		},
		
		a_complete: function(data){
			this.emit("done", data);
		}

	}
);
