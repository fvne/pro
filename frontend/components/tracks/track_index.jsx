const React = require('react');
const TrackIndexItem = require('./track_index_item');
const TrackStore = require('../../stores/track_store');
const TrackForm = require('../tracks/track_form');
const ErrorActions = require('../../actions/error_actions');

const _listeners = [];
let _loadingTracks = false;

module.exports = React.createClass({
  getInitialState () {
    return {tracks: TrackStore.all(), updateTrack: null};
  },
  componentWillMount () {
    window.addEventListener('scroll', this._onScroll);
    _listeners.push(TrackStore.addListener(this._onChange));
    this.props.fetchInitialTracks();
    _loadingTracks = true;
  },
  componentWillReceiveProps (newProps) {
    newProps.fetchInitialTracks();
    _loadingTracks = true;
  },
  componentWillUnmount () {
    window.removeEventListener('scroll', this._onScroll);
    _listeners.forEach(listener => listener.remove());
  },
  _onScroll (e) {
    const maxScrollY = $('.main-content').height() / 2;
    if (!_loadingTracks && window.scrollY >= maxScrollY) {
      const offset = this.state.tracks.length;
      this.props.fetchMoreTracks(offset);
      _loadingTracks = true;
    }
  },
  _onChange () {
    this.setState({tracks: TrackStore.all()}, function () {
      _loadingTracks = false;
    });
  },
  _updateTrack (track) {
    this.setState({updateTrack: track}, function () {
      ErrorActions.removeErrors();
      $("#UPDATE-TRACK-MODAL").modal("show");
    });
  },
  render () {
    // seperate tracks into rows
    const numTracks = this.state.tracks.length;
    const numRows = Math.ceil(numTracks / 4);
    const rows = [];
    for (let i = 0; i < numRows; i++) { rows.push([]); }
    for (let i = 0; i < numTracks; i++) {
      const RowIndex = Math.floor(i / 4);
      rows[RowIndex].push(this.state.tracks[i]);
    }
    return (
      <div>
        <div className='track-index'>{
          rows.map(row => {
            return (
              <div key={row[0].storeId} className="track-index-row">{
                row.map(track => {
                  return <TrackIndexItem key={track.storeId}
                                         track={track}
                                         indexType={this.props.indexType}
                                         updateTrack={this._updateTrack}/>;
                })
              }</div>
            );
          })
        }</div>
        {this.props.indexType === "MY_TRACKS" ?
          <TrackForm formType="UPDATE" track={this.state.updateTrack} /> :
          ""}
      </div>
    );
  }
});