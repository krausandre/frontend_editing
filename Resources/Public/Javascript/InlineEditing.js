(function($, w){

	var editorConfig = {
		entities_latin: false,
		htmlEncodeOutput: false,
		allowedContent: true,
		toolbarGroups: [
			{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
			{ name: 'editing', groups: [ 'find', 'selection' ] },
			{ name: 'links' },
			{ name: 'insert' },
			{ name: 'tools' },
			{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
			{ name: 'others' },
			'/',
			{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
			{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
			{ name: 'styles' }
		]
	};

	var pageUrl = window.location.protocol + '//' + window.location.host;
	var functionRoutes = {
		'crud': '?type=1470741815'
	};

	var deferred = $.Deferred();
	var iframe = $('.frontend-editing-iframe-wrapper iframe').attr({
		'src': iframeUrl
	});

	iframe.load(deferred.resolve);

	deferred.done(function() {

		// Add custom configuration to ckeditor
		$('.frontend-editing-iframe-wrapper iframe').contents().find('div[contenteditable=\'true\']').each(function() {
			$(this).ckeditor(editorConfig);
		});

		CKEDITOR.on('instanceReady', function(event) {

			// @TODO: This moves the dom instances of ckeditor into the top bar
			$('.frontend-editing-iframe-wrapper iframe').contents().find('div[contenteditable=\'true\']').each(function() {
				var editorDomInstance = $(this).ckeditor().editor.id;
				$('.' + editorDomInstance).detach().appendTo('.frontend-editing-top-bar');
			});

			var editor = event.editor;
			editor.on('change', function(changeEvent) {
				if (typeof editor.element !== 'undefined') {
					var dataSet = editor.element.$.dataset;
					var data = {
						'action': 'save',
						'table': dataSet.table,
						'uid': dataSet.uid,
						'field': dataSet.field,
						'content': editor.getData()
					};

					$.ajax({
						type: 'POST',
						url: pageUrl + functionRoutes.crud,
						dataType: 'JSON',
						data: data
					}).done(function(data, textStatus, jqXHR) {
						toastr.success('Content (uid: "' + data.message +'") have been saved!', 'Content saved');
					}).fail(function(jqXHR, textStatus, errorThrown) {
						toastr.error(errorThrown, 'Something went wrong');
					});
				}
			});
		});
	});

})(jQuery, window);