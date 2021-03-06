var adminVisualizationFusionchart = new Class({
	
	initialize: function(){
		this.options = Object.extend({
			ajaxmethod:'post'
		}, arguments[0] || {});
		this.updateFieldsEvent = this.updateFields.bindWithEvent(this);
		this.addRowEvent = this.addRow.bindWithEvent(this);
		$('paramsfusionchart_table').addEvent('change', this.updateFieldsEvent);
		this.watchDelete();
		$('fusionchart_addElement').addEvent('click', this.addRowEvent);
		for(var i=1;i<this.options.elements.length;i++){
			this.addRow();
		}
		this.periodical = this.updateFields.periodical(100, this);
	},
	
	updateValues: function(){
		$$('.fusionchart_addElementtable').each(function(t, x){
			t.getElement('select').getElements('option').each(function(opt, y){
				if(opt.value == this.options.elements[x]){
					t.getElement('select').selectedIndex = y;
				}
			}.bind(this));
			var fields = t.getElements('input'); 
			fields[0].value = this.options.axis_labels[x];
			fields[1].value = this.options.colours[x];
		}.bind(this))		
	},
	
	addRow: function(e){
		var t = $$('.fusionchart_addElementtable').getLast();
		t.clone().inject(t, 'after');
		if(e){
			new Event(e).stop();	
		}
		this.watchDelete();
		this.updateValues();
	},
	
	watchDelete: function(){
		$$('.fusionchart_deleteElementtable').removeEvents();
		$$('.fusionchart_deleteElementtable').show();
		$E('.fusionchart_deleteElementtable').hide();
		$$('.fusionchart_deleteElementtable').addEvent('click', function(event){
			var e = new Event(event);
			if($$('.fusionchart_deleteElementtable').length > 1){
				$(e.target).findUp('tr').dispose();
				this.watchDelete();
			}
			e.stop();
		}.bind(this));
	},
	
	updateFields: function(e){
		var table = $('paramsfusionchart_table').get('value');
		if(table != ''){
			clearInterval(this.periodical);
			$$('.'+this.options.targetClass).empty();
			var url = this.options.livesite + 'index.php?option=com_fabrik&format=raw&view=plugin&task=pluginAjax&g=visualization&plugin=fusionchart&method=ajax_fields&k=2&t=' + table;
			var myAjax = new Request({url:url, method:this.options.ajaxmethod, 
				onComplete: function(r){
					var opts = eval(r);
					
					opts.each( function(opt, x){
						var o = {'value':opt.value};
						if(opt.value == this.options.value){
							o.selected = 'selected';
						}
						$$('.'+this.options.targetClass).each(function(selList){
							var option = new Element('option', o).appendText(opt.label); 
							option.inject(selList);	
						})
					}.bind(this));
					this.updateValues();
				}.bind(this)
			}).send();
			if(e){
				new Event(e).stop();
			}
		}
	}
})