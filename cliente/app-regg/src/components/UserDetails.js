import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetails = ({ username }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    axios.get(`https://api.github.com/users/${username}`)
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error fetching user ${username}:`, error);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Username: {user.login}</p>
      <p>Bio: {user.bio}</p>
      <img src={user.avatar_url} alt="User avatar" style={{ width: "200px", borderRadius: "50%" }} />
    </div>
  );
};

export default UserDetails;
```
