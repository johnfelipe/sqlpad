import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal';
import Tooltip from 'antd/lib/tooltip';
import React from 'react';
import EditableTagGroup from '../common/EditableTagGroup';
import { Link } from 'react-router-dom';
import { connect } from 'unistore/react';
import { actions } from '../stores/unistoreStore';

function mapStateToProps(state) {
  return {
    availableTags: state.availableTags,
    queryId: state.query && state.query._id,
    queryTags: state.query && state.query.tags,
    showModal: state.showModal
  };
}

const ConnectedQueryDetailsModal = connect(
  mapStateToProps,
  actions
)(React.memo(QueryDetailsModal));

function QueryDetailsModal({
  queryId,
  queryTags,
  showModal,
  setQueryState,
  availableTags,
  handleModalHide
}) {
  const tagOptions = availableTags.slice();
  if (queryTags) {
    queryTags.forEach(t => {
      if (tagOptions.indexOf(t) === -1) {
        tagOptions.push(t);
      }
    });
  }

  const renderNavLink = (href, text) => {
    const saved = !!queryId;
    if (saved) {
      return (
        <li role="presentation">
          <Link to={href} target="_blank" rel="noopener noreferrer">
            {text} <Icon type="export" />
          </Link>
        </li>
      );
    } else {
      return (
        <Tooltip title="Save query to enable table/chart view links">
          <li role="presentation" className="disabled">
            <Link
              to={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.preventDefault()}
            >
              {text} <Icon type="export" />
            </Link>
          </li>
        </Tooltip>
      );
    }
  };

  const tableUrl = `/query-table/${queryId}`;
  const chartUrl = `/query-chart/${queryId}`;

  return (
    <Modal
      width={'600px'}
      visible={showModal}
      cancelText={null}
      onCancel={handleModalHide}
      footer={null}
    >
      <label>Query Tags</label>
      <EditableTagGroup
        tags={queryTags}
        onChange={values => setQueryState('tags', values)}
        tagOptions={tagOptions}
      />
      <hr />
      <p>
        <label>Shortcuts</label>
      </p>
      <ul style={{ paddingLeft: 0 }}>
        <li style={{ listStyleType: 'none', marginBottom: 8 }}>
          <code>ctrl+s</code> / <code>command+s</code> : Save
        </li>
        <li style={{ listStyleType: 'none', marginBottom: 8 }}>
          <code>ctrl+return</code> / <code>command+return</code> : Run
        </li>
        <li style={{ listStyleType: 'none', marginBottom: 8 }}>
          <code>shift+return</code> : Format
        </li>
      </ul>
      <hr />
      <p>
        <strong>Tip</strong>
      </p>
      <p>Run only a portion of a query by highlighting it first.</p>
      <hr />
      <ul className="nav nav-pills nav-justified">
        {renderNavLink(tableUrl, 'Link to Table')}
        {renderNavLink(chartUrl, 'Link to Chart')}
      </ul>
    </Modal>
  );
}

export default ConnectedQueryDetailsModal;
