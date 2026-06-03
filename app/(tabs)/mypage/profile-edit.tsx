import { updateNickname, updatePassword } from "@/lib/api/mypage";
import { queryKeys } from "@/lib/queryKeys";
import { colors, spacing, typography } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { mypageHomeOptions } from "./_components/queries";

type ProfileEditFormValues = {
  nickname: string;
  newPassword?: string;
  newPasswordConfirm?: string;
};

const profileEditSchema = z
  .object({
    nickname: z
      .string()
      .min(2, "닉네임은 2자 이상이어야 해요.")
      .max(8, "닉네임은 8자 이하여야 해요.")
      .regex(/^[가-힣a-zA-Z]+$/, "한글 또는 영문만 입력 가능해요."),
    newPassword: z
      .union([
        z
          .string()
          .min(8, "비밀번호는 8자 이상이어야 해요.")
          .max(16, "비밀번호는 16자 이하여야 해요.")
          .regex(
            /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
            "영어 대소문자와 특수문자를 포함해야 해요.",
          ),
        z.literal(""),
      ])
      .optional(),
    newPasswordConfirm: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.newPassword) return true;
      return data.newPassword === data.newPasswordConfirm;
    },
    {
      message: "비밀번호가 일치하지 않아요.",
      path: ["newPasswordConfirm"],
    },
  );

export default function ProfileEditScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

  const queryClient = useQueryClient();
  const { data } = useQuery(mypageHomeOptions());

  const nicknameMutation = useMutation({
    mutationFn: (nickname: string) => updateNickname(nickname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mypage.home() });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: ({
      newPassword,
      newPasswordConfirm,
    }: {
      newPassword: string;
      newPasswordConfirm: string;
    }) => updatePassword(newPassword, newPasswordConfirm),
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      nickname: data?.nickname ?? "",
      newPassword: "",
      newPasswordConfirm: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (data?.nickname) {
      reset({
        nickname: data.nickname,
        newPassword: "",
        newPasswordConfirm: "",
      });
    }
  }, [data?.nickname, reset]);

  const newPassword = watch("newPassword");

  const isSubmitDisabled =
    !!errors.nickname ||
    (!!newPassword && (!!errors.newPassword || !!errors.newPasswordConfirm));

  const onSubmit: SubmitHandler<ProfileEditFormValues> = async (data) => {
    try {
      const promises: Promise<unknown>[] = [];

      if (
        data.nickname !==
        queryClient.getQueryData(mypageHomeOptions().queryKey)?.nickname
      ) {
        promises.push(nicknameMutation.mutateAsync(data.nickname));
      }

      if (data.newPassword) {
        promises.push(
          passwordMutation.mutateAsync({
            newPassword: data.newPassword,
            newPasswordConfirm: data.newPasswordConfirm ?? "",
          }),
        );
      }

      await Promise.all(promises);
      router.back();
    } catch {
      Alert.alert("오류", "변경에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={colors.gray800} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>프로필 편집</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <View style={styles.content}>
            {/* 닉네임 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>닉네임</Text>
              <Controller
                control={control}
                name="nickname"
                render={({ field: { value, onBlur, onChange } }) => (
                  <TextInput
                    style={[
                      styles.inputBox,
                      !!errors.nickname && styles.inputBoxError,
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    placeholderTextColor={colors.gray400}
                  />
                )}
              />
              {errors.nickname && (
                <Text style={styles.errorText}>{errors.nickname.message}</Text>
              )}
            </View>

            {/* 새 비밀번호 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>새 비밀번호</Text>
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View
                    style={[
                      styles.inputRow,
                      !!errors.newPassword && styles.inputRowError,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!passwordVisible}
                      autoCapitalize="none"
                      placeholderTextColor={colors.gray400}
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                      <Ionicons
                        name={passwordVisible ? "eye" : "eye-off"}
                        size={18}
                        color={colors.gray600}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.newPassword ? (
                <Text style={styles.errorText}>
                  {errors.newPassword.message}
                </Text>
              ) : !newPassword ? (
                <Text style={styles.hintText}>
                  * 8-16자 이내, 영어 대소문자와 특수문자를 포함해주세요.
                </Text>
              ) : null}
            </View>

            {/* 새 비밀번호 확인 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>새 비밀번호 확인</Text>
              <Controller
                control={control}
                name="newPasswordConfirm"
                render={({ field: { value, onBlur, onChange } }) => (
                  <View
                    style={[
                      styles.inputRow,
                      !!errors.newPasswordConfirm && styles.inputRowError,
                    ]}
                  >
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!passwordConfirmVisible}
                      autoCapitalize="none"
                      placeholderTextColor={colors.gray400}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setPasswordConfirmVisible(!passwordConfirmVisible)
                      }
                    >
                      <Ionicons
                        name={passwordConfirmVisible ? "eye" : "eye-off"}
                        size={18}
                        color={colors.gray600}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.newPasswordConfirm && (
                <Text style={styles.errorText}>
                  {errors.newPasswordConfirm.message}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* 완료 버튼 */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitDisabled && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitDisabled}
        >
          <Text style={styles.submitButtonText}>완료</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.contentArea,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 72,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.subtitleMedium14,
    color: colors.gray800,
  },
  headerPlaceholder: {
    width: 24,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.subtitleMedium14,
    color: colors.gray700,
  },
  inputBox: {
    width: "100%",
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    ...typography.subtitleMedium14,
    color: colors.gray600,
  },
  inputBoxError: {
    borderColor: colors.primary600,
  },
  inputRow: {
    width: "100%",
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
  },
  inputRowError: {
    borderColor: colors.primary600,
  },
  input: {
    flex: 1,
    ...typography.subtitleMedium14,
    color: colors.gray600,
  },
  hintText: {
    ...typography.subtitleMedium14,
    fontSize: 13,
    color: colors.primary600,
  },
  errorText: {
    ...typography.subtitleMedium14,
    fontSize: 13,
    color: colors.primary600,
  },
  submitButton: {
    marginHorizontal: spacing.contentArea,
    marginBottom: spacing.lg,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.primary600,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: colors.primary100,
  },
  submitButtonText: {
    ...typography.subtitleMedium14,
    color: colors.white,
  },
});
