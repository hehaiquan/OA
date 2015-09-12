/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    config.uiColor = '#D9EDF7';
    config.toolbar = [
['Source', 'NewPage'],
['Cut', 'Copy', 'Paste', 'PasteText', 'Print'],
['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'],
'/',
['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote'],
['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
['Link', 'Unlink', 'Anchor'],
['Table', 'Smiley', 'SpecialChar'],
'/',
['Styles', 'Format', 'Font', 'FontSize'],
['TextColor', 'BGColor'],
['Maximize', 'About']
    ];
    config.removePlugins = 'elementspath';
};
