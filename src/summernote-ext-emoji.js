(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}(function ($) {
    $.extend($.summernote.plugins, {
        'emoji': function (context) {
            var self = this;
            var ui = $.summernote.ui;
            var emojis = ['smile', 'laughing', 'blush', 'joy', 'smiley', 'stuck_out_tongue_closed_eyes', 'smirk', 'heart_eyes', 'sob', 'sweat_smile', 'kissing_closed_eyes', 'flushed', 'relieved', 'satisfied', 'grin', 'wink', 'stuck_out_tongue_winking_eye', 'grinning', 'kissing', 'kissing_smiling_eyes', 'stuck_out_tongue', 'sleeping', 'anguished', 'open_mouth', 'confused', 'expressionless', 'unamused', 'sweat', 'disappointed_relieved', 'weary', 'pensive', 'disappointed', 'confounded', 'fearful', 'cold_sweat', 'persevere', 'cry', 'astonished', 'scream', 'neckbeard', 'tired_face', 'angry', 'rage', 'triumph', 'sleepy', 'yum', 'mask', 'sunglasses', 'dizzy_face', 'imp', 'smiling_imp', 'neutral_face', 'no_mouth', 'innocent', 'alien', 'heart', 'broken_heart', 'fire', 'poop', 'thumbsup', 'thumbsdown', 'ok_hand', 'punch', 'fist', 'v', 'wave', 'hand', 'raised_hand', 'open_hands', 'point_up', 'point_down', 'point_left', 'point_right', 'raised_hands', 'pray', 'point_up_2', 'clap', 'muscle', 'metal', 'smiley_cat', 'smile_cat', 'heart_eyes_cat', 'kissing_cat', 'smirk_cat', 'scream_cat', 'crying_cat_face', 'joy_cat', 'pouting_cat'];

            var chunk = function (val, chunkSize) {
                var R = [];
                for (var i = 0; i < val.length; i += chunkSize)
                    R.push(val.slice(i, i + chunkSize));
                return R;
            };

            /*IE polyfill*/
            if (!Array.prototype.filter) {
                Array.prototype.filter = function (fun /*, thisp*/) {
                    var len = this.length >>> 0;
                    if (typeof fun != "function")
                        throw new TypeError();

                    var res = [];
                    var thisp = arguments[1];
                    for (var i = 0; i < len; i++) {
                        if (i in this) {
                            var val = this[i];
                            if (fun.call(thisp, val, i, this))
                                res.push(val);
                        }
                    }
                    return res;
                };
            }

            var addListener = function () {
                $(document).on('click', '.closeEmoji', function(){
                    self.$panel.hide();
                });
                $(document).on('click', '.selectEmoji', function(){
                    var img = new Image();
                    img.src = '/js/summernote-emoji/pngs/'+$(this).attr('data-value')+'.png';
                    img.alt = $(this).attr('data-value');
                    img.className = 'emoji-icon-inline';
                    context.invoke('editor.insertNode', img);

                });
            };

            var render = function (emojis) {
                var emoList = '';
                /*limit list to 24 images*/
                var emojis = emojis;
                var chunks = chunk(emojis, 6);
                for (j = 0; j < chunks.length; j++) {
                    emoList += '<div class="row">';
                    for (var i = 0; i < chunks[j].length; i++) {
                        var emo = chunks[j][i];
                        emoList += '<div class="col-xs-2">' +
                        //'<a href="javascript:void(0)" class="selectEmoji closeEmoji" data-value="' + emo + '"><span class="emoji-icon" style="background-image: url(\'' + document.emojiSource + emo + '.png\');"></span></a>' +
                        '<a href="javascript:void(0)" class="selectEmoji closeEmoji" data-value="' + emo + '"><img src="' + document.emojiSource + emo + '.png" class="emoji-icon" /></a>' +
                        '</div>';
                    }
                    emoList += '</div>';
                }

                return emoList;
            };

            var filterEmoji = function (value) {
                var filtered = emojis.filter(function (el) {
                    return el.indexOf(value) > -1;
                });
                return render(filtered);
            };

            // add emoji button
            context.memo('button.emoji', function () {
                // create button
                var button = ui.button({
                    contents: '<i class="fa fa-smile-o"/>',
                    //tooltip: 'emoji',
                    click: function () {
                        if(document.emojiSource === undefined)
                            document.emojiSource = '';

                        //self.$panel.show();
                        $('#emoji-dropdown').modal('show');
                    }
                });

                // create jQuery object from button instance.
                var $emoji = button.render();
                return $emoji;
            });

            // This events will be attached when editor is initialized.
            this.events = {
                // This will be called after modules are initialized.
                'summernote.init': function (we, e) {
                    addListener();
                },
                // This will be called when user releases a key on editable.
                'summernote.keyup': function (we, e) {
                }
            };

            // This method will be called when editor is initialized by $('..').summernote();
            // You can create elements for plugin
            this.initialize = function () {
                this.$panel = $('<div class="modal fade"  role="dialog" id="emoji-dropdown">' +
                        '<div class="modal-dialog">'+
                            '<div class="modal-content">'+
                                '<div class="modal-header">'+
                                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
                                '</div>'+
                                '<div class="modal-body">'+
                                    '<div class="emoji-list">' +
                                    render(emojis) +
                                    '</div>' +
                                '</div>'+
                            '</div>'+
                        '</div>'+
                '</div>').hide();

                this.$panel.appendTo('body');
            };

            this.destroy = function () {
                this.$panel.remove();
                this.$panel = null;
            };
        }
    });
}));
