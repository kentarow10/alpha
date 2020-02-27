/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useContext, createContext, useEffect } from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContext } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { GetAuth } from '../store/auth/auth';
import firebase from '../../firebase/firebase';
