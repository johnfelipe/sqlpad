import PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';
import Layout from 'antd/lib/layout';
import Menu from 'antd/lib/menu';
import Modal from 'antd/lib/modal';
import React, { useState, useCallback } from 'react';
import { connect } from 'unistore/react';
import { actions } from './stores/unistoreStore';
import { Redirect, Route } from 'react-router-dom';
import AboutContent from './AboutContent';
import fetchJson from './utilities/fetch-json.js';
import ConnectionListDrawer from './connections/ConnectionListDrawer';
import ConfigurationDrawer from './configuration/ConfigurationDrawer';
import UsersDrawer from './users/UserDrawer';

const { Content, Sider } = Layout;

function AppNav({ children, pageMenuItems, currentUser, version }) {
  const [collapsed, setCollapsed] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const handleConfigClose = useCallback(() => setShowConfig(false), []);
  const handleUsersClose = useCallback(() => setShowUsers(false), []);

  if (redirect) {
    return <Redirect push to="/signin" />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        className="overflow-y-scroll"
        collapsible
        collapsed={collapsed}
        onCollapse={collapsed => setCollapsed(collapsed)}
      >
        <div
          style={{
            minHeight: '100vh',
            paddingBottom: '50px',
            paddingTop: '64px'
          }}
          className="flex flex-column justify-between"
        >
          <Route
            render={({ history }) => (
              <Menu theme="dark" selectable={false} mode="inline">
                <Menu.Item
                  key="queries"
                  onClick={() => {
                    history.push('/queries');
                  }}
                >
                  <Icon type="file-text" />
                  <span>Queries</span>
                </Menu.Item>
                <Menu.Item
                  key="new-query"
                  onClick={() => {
                    history.push('/queries/new');
                  }}
                >
                  <Icon type="plus" />
                  <span>New Query</span>
                </Menu.Item>
                {pageMenuItems}
              </Menu>
            )}
          />
          <Route
            render={({ history }) => (
              <Menu theme="dark" selectable={false} mode="inline">
                {currentUser.role === 'admin' && [
                  <Menu.Item
                    key="connections-drawer"
                    onClick={() => setShowConnections(true)}
                  >
                    <Icon type="database" />
                    <span>DB connections</span>
                  </Menu.Item>,
                  <Menu.Item key="users" onClick={() => setShowUsers(true)}>
                    <Icon type="team" />
                    <span>Users</span>
                  </Menu.Item>,
                  <Menu.Item
                    key="configuration"
                    onClick={() => setShowConfig(true)}
                  >
                    <Icon type="setting" />
                    <span>Configuration</span>
                  </Menu.Item>
                ]}
                {version && version.updateAvailable && (
                  <Menu.Item
                    key="update"
                    onClick={() => {
                      Modal.info({
                        title: 'Update Available (' + version.updateType + ')',
                        maskClosable: true,
                        content: (
                          <div>
                            Installed Version: {version.current}
                            <br />
                            Latest: {version.latest}
                          </div>
                        ),
                        onOk() {}
                      });
                    }}
                  >
                    <Icon type="exclamation-circle-o" />
                    <span>Update available</span>
                  </Menu.Item>
                )}
                <Menu.Item
                  key="about"
                  onClick={() => {
                    Modal.info({
                      width: 650,
                      title: 'About SQLPad',
                      maskClosable: true,
                      content: (
                        <AboutContent version={version && version.current} />
                      ),
                      onOk() {}
                    });
                  }}
                >
                  <Icon type="question-circle-o" />
                  <span>About</span>
                </Menu.Item>
                <Menu.Item
                  key="signout"
                  onClick={async () => {
                    await fetchJson('GET', '/api/signout');
                    setRedirect(true);
                  }}
                >
                  <Icon type="logout" />
                  <span>Sign out</span>
                </Menu.Item>
              </Menu>
            )}
          />
        </div>
      </Sider>
      <Layout className="flex w-100 bg-white">
        <Content className="flex w-100">{children}</Content>
      </Layout>
      <ConnectionListDrawer
        visible={showConnections}
        onClose={() => setShowConnections(false)}
      />
      <ConfigurationDrawer visible={showConfig} onClose={handleConfigClose} />
      <UsersDrawer visible={showUsers} onClose={handleUsersClose} />
    </Layout>
  );
}

AppNav.propTypes = {
  pageMenuItems: PropTypes.arrayOf(PropTypes.node)
};

export default connect(
  ['currentUser', 'version'],
  actions
)(AppNav);
