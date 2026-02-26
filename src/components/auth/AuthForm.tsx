"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/i18n";
import { getIsRTL } from "@/i18n";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform, TextStyle } from "react-native";

type AuthMode = "signup" | "login" | "mfa";

export function AuthForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mfaCode, setMfaCode] = useState<string>("");
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { login, signup, verifyMfa, isLoading, isAuthenticated, user, mfaRequired } = useAuth();

  const isRTL = getIsRTL();

  useEffect(() => {
    if (isAuthenticated && user) {
      setSuccessMessage(t("auth_success_welcome", { nickname: user.nickname }));
      setError(null);
      // Optionally redirect or close form
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (mfaRequired) {
      setMode("mfa");
      setError(null);
      setSuccessMessage(t("mfa_prompt_code"));
    }
  }, [mfaRequired]);

  const handleSubmit = async () => {
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === "login") {
        await login(email, password);
        // If login is successful and MFA is not required, set success message
        if (!mfaRequired) {
          setSuccessMessage(t("login_success"));
        }
      } else if (mode === "signup") {
        await signup(email, password);
        setSuccessMessage(t("signup_success"));
        setMode("login"); // After signup, prompt for login
      } else if (mode === "mfa") {
        await verifyMfa(email, mfaCode);
        setSuccessMessage(t("mfa_success"));
      }
    } catch (err: any) {
      setError(err.message || t("auth_error_generic"));
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
    setSuccessMessage(null);
    setEmail(""); // Clear fields on mode toggle
    setPassword("");
    setMfaCode("");
  };

  return (
    <View style={{
      maxWidth: 448, // max-w-md
      marginHorizontal: 'auto', // mx-auto
      padding: 32, // p-8
      borderWidth: 1,
      borderColor: '#d1d5db', // border-gray-300
      borderRadius: 8, // rounded-lg
      shadowColor: '#000', // shadow-lg
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5, // For Android shadow
      backgroundColor: '#fff',
    }}>
      <Text style={{
        fontSize: 28, // text-3xl
        fontWeight: 'bold',
        color: '#1e40af', // text-blue-800
        marginBottom: 24, // mb-6
        textAlign: 'center',
      }}>
        {mode === "login" && t("login_title")}
        {mode === "signup" && t("signup_title")}
        {mode === "mfa" && t("mfa_title")}
      </Text>

      {error && (
        <View style={{
          backgroundColor: '#fee2e2', // bg-red-100
          borderWidth: 1,
          borderColor: '#ef4444', // border-red-400
          paddingHorizontal: 16, // px-4
          paddingVertical: 12, // py-3
          borderRadius: 4, // rounded
          marginBottom: 16, // mb-4
        }}>
          <Text style={{ color: '#b91c1c' /* text-red-700 */ }}>{error}</Text>
        </View>
      )}

      {successMessage && (
        <View style={{
          backgroundColor: '#dcfce7', // bg-green-100
          borderWidth: 1,
          borderColor: '#22c55e', // border-green-400
          paddingHorizontal: 16, // px-4
          paddingVertical: 12, // py-3
          borderRadius: 4, // rounded
          marginBottom: 16, // mb-4
        }}>
          <Text style={{ color: '#15803d' /* text-green-700 */ }}>{successMessage}</Text>
        </View>
      )}

      <View style={{ rowGap: 16 /* space-y-4 */ }}>
        {(mode === "login" || mode === "signup") && (
          <>
            <View>
              <Text style={{
                color: '#374151', // text-gray-700
                fontSize: 14, // text-sm
                fontWeight: 'bold',
                marginBottom: 8, // mb-2
                textAlign: isRTL ? 'right' : 'left',
              } as TextStyle}>
                {t("email_label")}
              </Text>
              <TextInput
                keyboardType="email-address"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: '#e5e7eb', // border
                  borderRadius: 4, // rounded
                  width: '100%', // w-full
                  paddingVertical: 8, // py-2
                  paddingHorizontal: 12, // px-3
                  color: '#374151', // text-gray-700
                  lineHeight: 20, // leading-tight
                  ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
                  textAlign: isRTL ? 'right' : 'left',
                }}
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View>
              <Text style={{
                color: '#374151', // text-gray-700
                fontSize: 14, // text-sm
                fontWeight: 'bold',
                marginBottom: 8, // mb-2
                textAlign: isRTL ? 'right' : 'left',
              } as TextStyle}>
                {t("password_label")}
              </Text>
              <TextInput
                secureTextEntry
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 1.41,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: '#e5e7eb', // border
                  borderRadius: 4, // rounded
                  width: '100%', // w-full
                  paddingVertical: 8, // py-2
                  paddingHorizontal: 12, // px-3
                  color: '#374151', // text-gray-700
                  marginBottom: 12, // mb-3
                  lineHeight: 20, // leading-tight
                  ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
                  textAlign: isRTL ? 'right' : 'left',
                }}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
            </View>
          </>
        )}

        {mode === "mfa" && (
          <View>
            <Text style={{
              color: '#374151', // text-gray-700
              fontSize: 14, // text-sm
              fontWeight: 'bold',
              marginBottom: 8, // mb-2
              textAlign: isRTL ? 'right' : 'left',
            } as TextStyle}>
              {t("mfa_code_label")}
            </Text>
            <TextInput
              keyboardType="numeric"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.41,
                elevation: 2,
                borderWidth: 1,
                borderColor: '#e5e7eb', // border
                borderRadius: 4, // rounded
                width: '100%', // w-full
                paddingVertical: 8, // py-2
                paddingHorizontal: 12, // px-3
                color: '#374151', // text-gray-700
                lineHeight: 20, // leading-tight
                ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
                textAlign: isRTL ? 'right' : 'left',
              }}
              value={mfaCode}
              onChangeText={setMfaCode}
              editable={!isLoading}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: isLoading ? '#93c5fd' : '#2563eb', // bg-blue-600, hover:bg-blue-700
            paddingVertical: 8, // py-2
            paddingHorizontal: 16, // px-4
            borderRadius: 4, // rounded
            width: '100%', // w-full
            opacity: isLoading ? 0.7 : 1,
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{
              color: '#fff', // text-white
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              {mode === "login" ? t("login_button") :
                mode === "signup" ? t("signup_button") :
                  t("mfa_verify_button")}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {(mode === "login" || mode === "signup") && (
        <View style={{ marginTop: 24, textAlign: 'center' }}>
          <TouchableOpacity
            onPress={toggleMode}
            style={{ opacity: isLoading ? 0.7 : 1 }}
            disabled={isLoading}
          >
            <Text style={{
              color: '#3b82f6', // text-blue-500
              fontSize: 14, // text-sm
              textAlign: 'center',
            }}>
              {mode === "login" ? t("no_account_signup") : t("have_account_login")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
