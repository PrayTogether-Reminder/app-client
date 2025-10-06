import React from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { color } from "@/common/styles/color";

type MemberSearchInputProps = {
  searchQuery: string;
  onChangeSearch: (query: string) => void;
  onSearch: () => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function MemberSearchInput({
  searchQuery,
  onChangeSearch,
  onSearch,
  placeholder = "이름으로 검색",
  disabled = false,
}: MemberSearchInputProps) {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeSearch}
        onIconPress={onSearch}
        onSubmitEditing={onSearch}
        value={searchQuery}
        style={styles.searchbar}
        inputStyle={styles.input}
        editable={!disabled}
        iconColor={color.secondary}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(12),
  },
  searchbar: {
    elevation: 2,
    borderRadius: RFValue(8),
  },
  input: {
    fontSize: RFValue(15),
  },
});
