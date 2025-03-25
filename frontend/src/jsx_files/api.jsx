/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const client = axios.create({
  baseURL: "http://localhost:8000/handshake",
  withCredentials: true,
  headers: {
    'X-CSRFToken': sessionStorage.getItem('csrftoken')
  }
});

export async function fetchEvents() {
  const response = await client.get('/noticeboard/');
  if (response.status !== 200) {
    throw new Error('Network response was not ok');
  }
  return response.data;
}

export const fetchUserEvents = async (userID, loop_block=0) => {
  try {
    const access_token = sessionStorage.getItem("access_token");
    const response = await client.get(`/user_events/?u=${userID}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });
    return response.data;
  } catch (error) {
    if (!loop_block) {
      await refreshHandling(error, () => fetchUserEvents(userID, 1));
    } else {
      console.error('Error fetching user Events:', error);
      throw error;
    }
  }
};

export const fetchUserPosts = async (userID, loop_block=0) => {
  try {
    const access_token = sessionStorage.getItem("access_token");
    const response = await client.get(`/user_posts/?u=${userID}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });
    return response.data;
  } catch (error) {
    if (!loop_block) {
      await refreshHandling(error, () => fetchUserPosts(userID, 1));
    } else {
      console.error('Error fetching user Posts:', error);
      throw error;
    }
  }
};

export const createPostEvent = async (postEvent) => {
  try {
    const response = await client.post('/noticeboard/', postEvent);
    return response;
  } catch (error) {
    console.error('Error creating post/event:', error);
    throw error;
  }
};


export const fetchOrganisations = async (loop_block=0) => {
  try {
    const response = await client.get(`/organisations/`, {});
    return response.data;
  } catch (e) {
      if (!loop_block) {
        if (e.response && e.response.status === 401) {
          refreshAccessToken(refresh_token);
          return fetchOrganisations(1)
        }
        else {
          console.error('Error fetching organisations: ', e);
          throw e;
        }
    }
  }
};


export const deleteAccount = async (loop_block=0) => {
  try {
    const access_token = sessionStorage.getItem('access_token');
    await client.delete('/deleteAccount/', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    sessionStorage.clear();
  } catch (e) {
    if (!loop_block) {
      await refreshHandling(e, deleteAccount);
    } else {
      console.log('Unable to delete account at this time');
      alert('Unable to delete account at this time');
    }
  }
};

export const logout = async (loop_block=0) => {
  const access_token = sessionStorage.getItem("access_token");
  const refresh_token = sessionStorage.getItem("refresh_token");
  try {
    await client.post("/logout/", { refresh_token }, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    sessionStorage.clear();
    getNavigate()("/login");
  } catch (e) {
    if (!loop_block) {
      console.log('Refreshing token');
      await refreshHandling(e, logout);
    } else {
      alert("session has timed out")
      sessionStorage.clear();
      getNavigate()("/login");
    }
  }
};

export const fetchUsername = async (userID, loop_block=0) => {
  try {    
    const access_token = sessionStorage.getItem("access_token");
    if (access_token) {
      const response = await client.post("/get-username/", 
        {"userID": userID },
        {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      return response.data;
    }
  } catch (e) {
    if (!loop_block) {
      await refreshHandling(e, () => fetchUsername(userID, 1));
    } else {
      console.log('Unable to fetch username at this time');
    }
  }
  return null;
};

export const updateProfile = async (profileData, loop_block=0) => {
  const access_token = sessionStorage.getItem("access_token");
  try {
    const response = await client.put("/profile/", profileData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });
    return response;
  }catch (e) {
    if (!loop_block) {
      await refreshHandling(e, () => updateProfile(profileData, 1));
    } else {
      console.error('Error fetching profile:', e);
      throw e;
    }
}};

export const login = async (username, password) => {
  try {
    const response = await client.post("/login/", { username, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const fetchProfile = async (userID, loop_block=0) => {
  if (!userID) {
    console.error('Error fetching profile: userID is null or undefined');
    throw new Error('userID is required to fetch profile');
  }

  const access_token = sessionStorage.getItem("access_token");
  try {
    const response = await client.get(`/profile/?u=${userID}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });
    return response.data;
  } catch (e) {
    if (!loop_block) {
      await refreshHandling(e, () => fetchProfile(userID, 1));
    } else {
      console.error('Error fetching profile:', e);
      throw e;
    }
  }
};

export const authenticateProfile = async (userID, loop_block=0) => {
  if (!userID) {
    console.error('Error authenticating profile: userID is null or undefined');
    throw new Error('userID is required to authenticate profile');
  }

  const access_token = sessionStorage.getItem("access_token");
  try {
    const response = await client.get(`/authenticate-profile/?u=${userID}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });
    return response.data;
  } catch (e) {
    if (!loop_block) {
      await refreshHandling(e, () => authenticateProfile(userID, 1));
    } else {
      console.error('Error authenticating profile:', e);
      throw e;
    }
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await client.post("/register/", userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const fetchSearchResults = async (query, filters, dateSort, university, pageNumber) => {
  try {
    const response = await client.get(`/search/results/?q=${query || ''}&filters=${filters}&orderby=${dateSort}&university=${university}&p=${pageNumber}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
    throw error;
  }
};

export const deletePostEvent = async (id, loop_block=0) => {
  const access_token = sessionStorage.getItem("access_token");
  try {
    const response = await client.delete(`/noticeboard/${id}/`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });
    return response;
  } catch (e) {
    if (!loop_block) {
      await refreshHandling(e, deletePostEvent);
    } else {
      console.error('Error deleting post/event:', e);
      throw e;
    }
  }
};

export const createVIP = async (vipData) => {
  try {
    const access_token = sessionStorage.getItem("access_token");
    const response = await client.post('/create_vip/', vipData, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating VIP:', error);
    throw error;
  }
};

export const fetchUserVIPs = async (loop_block=0) => {
  try {
    const access_token = sessionStorage.getItem("access_token");
    const response = await client.get('/user_vips/', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });
    return response.data;
  } catch (error) {
    if (!loop_block) {
      await refreshHandling(error, fetchUserVIPs);
    } else {
      console.error('Error fetching user VIPs:', error);
      throw error;
    }
  }
};

export const fetchAllVIPs = async (loop_block = 0) => {
  try {
    const access_token = sessionStorage.getItem("access_token");
    const response = await client.get('/all_vips/', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all VIPs:', error);

    // Log the error details for debugging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request data:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    if (!loop_block) {
      await refreshHandling(error, fetchAllVIPs);
    } else {
      throw error; // Re-throw the error after logging
    }
  }
};

export const checkVerification = async (username) => {
  try {
    // Use the configured client instead of raw axios
    const response = await client.get(`/api/check-verification/${username}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/// HELPER FUNCTIONS FOR REFRESHING ACCESS TOKEN

export const refreshAccessToken = async (token) => {
  try {
    const response = await client.post("/token/refresh/", {
      refresh: token
    });
    sessionStorage.setItem("access_token", response.data.access);
  } catch (error) {
    console.error('Error refreshing access token:', error);
    logout(1);
  }
};

export const refreshHandling = async (e, fn) => {
  const refresh_token = sessionStorage.getItem('refresh_token');
  if (e.response && e.response.status === 401) {
      console.log('refreshing inside refreshHandler')
      await refreshAccessToken(refresh_token);
      fn(1)
    }
  // this should never happen but just to be sure do a forced logouts
  logout(1)
}


/// Allows me to use hooks inside api 

let globalNavigate = null;
export const setNavigate = (navigateFunction) => {
  globalNavigate = navigateFunction;
};

export const getNavigate = () => {
  if (!globalNavigate) {
    throw new Error("Navigate function is not set. Ensure you call setNavigate inside a component.");
  }
  return globalNavigate;
};