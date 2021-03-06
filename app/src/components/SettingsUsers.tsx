import {
    IonButton,
    IonItem,
    IonLabel,
    IonModal,
    IonList,
    IonAlert
  } from '@ionic/react';
  import React, { useState, useEffect } from 'react';
import SettingsUser from '../components/SettingsUser';
import { projectServices } from '../services/ProjectServices'
import { userService } from '../services/UserServices'

interface ContainerProps {
    project: string;
}

const SettingsUsers: React.FC<ContainerProps> = ({ project }) => {
    const [showUserModal, setShowUserModal] = useState(false);

    const initialUsers = [
        { id: 0, email: 'No users'}
    ]

    const [users, setUsers] = useState(initialUsers);
    useEffect(() => {
      try {
        projectServices.getProjectUsers(project)
        // userService.getAllUsers() // testing only
        .then(data => {
          setUsers(data)
        })
      } catch (e) {
        
      }
    }, [])

    const [allUsers, setAllUsers] = useState(initialUsers);
    useEffect(() => {
      try {
        userService.getAllUsers()
        .then(data => {
            setAllUsers(data)
        })
      } catch (e) {
        
      }
    }, [])

    function addUser(user: any) {
        projectServices.setProjectUsers(project, user);
        setShowUserModal(false)
      }

  return (
    <div className="container">
      <h2>Users</h2>
          {users.map((user) => {
            return (
                <SettingsUser key={user.email} user={user.email}></SettingsUser>
            );
          })}

        <IonButton size="small" fill="outline" onClick={() => setShowUserModal(true)}>
            + Add user
        </IonButton>

          <IonModal isOpen={showUserModal}>
          <IonItem text-align="center"><h3>Add user to project</h3></IonItem>
              <IonList>
              {allUsers.map((user) => {
                  if (!users.some(check => check.email === user.email)) {
                      return (
                          <IonItem key={user.email} button onClick={() => { addUser(user.email) }}>{user.email}</IonItem>
                      );
                  }
              })}
              </IonList>
              <IonButton fill="outline" onClick={() => setShowUserModal(false)}>Close</IonButton>
        </IonModal>
        </div>
    );
};

export default SettingsUsers;
