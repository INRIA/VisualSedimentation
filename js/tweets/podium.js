/* Author: Raphaël Velt, IRI
 * 
 * Licence: CeCILL-B - http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html
 * 
 * */

Btv_Podium = function(data, opts) {
    this.options = opts || {};
    this.options.container = this.options.container || 'podium';
    this.options.spacing = this.options.spacing || 20;
    this.options.barBgd = this.options.barBgd || '#ffffff';
    this.options.transitionDuration = this.options.transitionDuration || 200;
    this.$ = this.options.jquery || jQuery;
    this._$ = this.$('#' + this.options.container);
    if (!this._$.length) {
        var _el = document.createElement("div");
        _el.id = this.options.container;
        document.body.appendChild(_el);
        this._$ = this.$(_el);
    }
    this.options.width = this.options.width || this._$.width();
    this.options.height = this.options.height || this._$.height();
    this.options.minHeight = this.options.minHeight || 0;
    this.lastheights = [];
    this.update(data, true);
}

Btv_Podium.prototype.update = function(data, noAnimate) {
    var _data = data || [];
    while (_data.length > this._$.children().length) {
        var _newCol = document.createElement("div");
        this.$(_newCol).css({
            "float": "left",
            "background": this.options.barBgd,
            "width": 0,
            "height": 0,
            "margin-top": this.options.height,
            "margin-left": 0,
        });
        this._$.append(_newCol);
    }
    while (_data.length < this._$.children().length) {
        this._$.children().last().detach();
    }
    if (_data.length) {
        var _max = _data.reduce(function(_memo, _val) {
                return Math.max(_memo, _val);
            }, 1),
            _scale = (this.options.height - this.options.minHeight) / _max,
            _spacing = Math.min(this.options.spacing, Math.floor(.5*this.options.width/_data.length)),
            _width = Math.floor(( this.options.width - (_data.length - 1) * _spacing) / _data.length),
            _this = this,
            _heights = [];
        this._$.children().each(function(_i, _e) {
            var _height = Math.floor(_scale * _data[_i] + _this.options.minHeight),
                _css = {},
                _changed = false;
            _heights.push(_height);
            if (_data.length != _this.lastheights.length) {
                _css["width"] = _width;
                _css["margin-left"] = (_i ? _spacing : 0);
                _changed = true;
            }
            if (_i >= _data.length || _height != _this.lastheights[_i]) {
                _css["height"] = _height;
                _css["margin-top"] = _this.options.height - _height
                _changed = true;
            }
            if (_changed) {
                if (noAnimate) {
                    _this.$(_e).css(_css); 
                } else {
                    _this.$(_e).animate(_css);
                }
            }
        });
        this.lastheights = _heights;
    }
}