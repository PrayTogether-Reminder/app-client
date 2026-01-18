// 튜토리얼용 Mock UI 컴포넌트들
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { color } from "../../../styles/color";

// RFValue는 UI 스레드에서 호출하면 안 되므로 미리 계산
const ICON_SIZE_10 = RFValue(10);
const ICON_SIZE_14 = RFValue(14);
const ICON_SIZE_16 = RFValue(16);
const ICON_SIZE_18 = RFValue(18);
const SPACE_18 = RFValue(18);

// ==================== 폰 프레임 ====================
interface MockPhoneProps {
  children: React.ReactNode;
}

export const MockPhone: React.FC<MockPhoneProps> = ({ children }) => {
  return (
    <View style={mockPhoneStyles.container}>
      {/* 노치 */}
      <View style={mockPhoneStyles.notch} />
      {/* 콘텐츠 */}
      <View style={mockPhoneStyles.content}>{children}</View>
      {/* 홈 인디케이터 */}
      <View style={mockPhoneStyles.homeIndicator} />
    </View>
  );
};

const mockPhoneStyles = StyleSheet.create({
  container: {
    width: "85%",
    height: "95%",
    backgroundColor: "#fff",
    borderRadius: RFValue(24),
    borderWidth: 3,
    borderColor: color.primary,
    overflow: "hidden",
    alignSelf: "center",
  },
  notch: {
    width: RFValue(60),
    height: RFValue(20),
    backgroundColor: color.primary,
    borderBottomLeftRadius: RFValue(10),
    borderBottomRightRadius: RFValue(10),
    alignSelf: "center",
  },
  content: {
    flex: 1,
  },
  homeIndicator: {
    width: RFValue(80),
    height: RFValue(4),
    backgroundColor: color.gray + "60",
    borderRadius: RFValue(2),
    alignSelf: "center",
    marginBottom: RFValue(8),
  },
});

// ==================== 헤더 ====================
interface MockHeaderProps {
  title: string;
  showBack?: boolean;
  rightIcon?: string;
  rightIconHighlight?: boolean;
}

export const MockHeader: React.FC<MockHeaderProps> = ({
  title,
  showBack = false,
  rightIcon,
  rightIconHighlight = false,
}) => {
  return (
    <View style={mockHeaderStyles.container}>
      {showBack ? (
        <MaterialCommunityIcons
          name="arrow-left"
          size={ICON_SIZE_18}
          color={color.primary}
        />
      ) : (
        <View style={{ width: SPACE_18 }} />
      )}
      <Text style={mockHeaderStyles.title} numberOfLines={1}>
        {title}
      </Text>
      {rightIcon ? (
        <View
          style={[
            mockHeaderStyles.rightIconContainer,
            rightIconHighlight && mockHeaderStyles.rightIconHighlight,
          ]}
        >
          <MaterialCommunityIcons
            name={rightIcon as any}
            size={ICON_SIZE_18}
            color={color.primary}
          />
        </View>
      ) : (
        <View style={{ width: SPACE_18 }} />
      )}
    </View>
  );
};

const mockHeaderStyles = StyleSheet.create({
  container: {
    height: RFValue(36),
    backgroundColor: color.third,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: RFValue(12),
  },
  title: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: color.primary,
    flex: 1,
    textAlign: "center",
  },
  rightIconContainer: {
    padding: RFValue(4),
    borderRadius: RFValue(12),
  },
  rightIconHighlight: {
    backgroundColor: color.secondary + "40",
  },
});

// ==================== 하단 버튼 ====================
interface MockBottomButtonProps {
  icon: string;
  text: string;
  highlight?: boolean;
}

export const MockBottomButton: React.FC<MockBottomButtonProps> = ({
  icon,
  text,
  highlight = false,
}) => {
  return (
    <View style={mockBottomButtonStyles.container}>
      <View
        style={[
          mockBottomButtonStyles.button,
          highlight && mockBottomButtonStyles.buttonHighlight,
        ]}
      >
        <MaterialCommunityIcons
          name={icon as any}
          size={ICON_SIZE_14}
          color="#fff"
        />
        <Text style={mockBottomButtonStyles.text}>{text}</Text>
      </View>
    </View>
  );
};

const mockBottomButtonStyles = StyleSheet.create({
  container: {
    padding: RFValue(8),
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: color.secondary,
    borderRadius: RFValue(8),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: RFValue(10),
    gap: RFValue(6),
  },
  buttonHighlight: {
    transform: [{ scale: 1.02 }],
    shadowColor: color.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    color: "#fff",
    fontSize: RFValue(12),
    fontWeight: "bold",
  },
});

// ==================== FAB (플로팅 버튼) ====================
interface MockFABProps {
  icon?: string;
  label?: string;
  highlight?: boolean;
  position?: "bottomRight" | "center";
  useAntDesign?: boolean;
}

export const MockFAB: React.FC<MockFABProps> = ({
  icon = "plus",
  label,
  highlight = false,
  position = "bottomRight",
  useAntDesign = false,
}) => {
  const IconComponent = useAntDesign ? AntDesign : MaterialCommunityIcons;

  return (
    <View
      style={[
        mockFABStyles.container,
        position === "bottomRight" && mockFABStyles.positionBottomRight,
        position === "center" && mockFABStyles.positionCenter,
        highlight && mockFABStyles.highlight,
      ]}
    >
      <IconComponent name={icon as any} size={ICON_SIZE_16} color="#fff" />
      {label && <Text style={mockFABStyles.label}>{label}</Text>}
    </View>
  );
};

const mockFABStyles = StyleSheet.create({
  container: {
    backgroundColor: color.primary,
    borderRadius: RFValue(16),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(14),
    gap: RFValue(6),
  },
  positionBottomRight: {
    position: "absolute",
    bottom: RFValue(16),
    right: RFValue(16),
  },
  positionCenter: {
    alignSelf: "center",
  },
  highlight: {
    transform: [{ scale: 1.1 }],
    shadowColor: color.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  label: {
    color: "#fff",
    fontSize: RFValue(10),
    fontWeight: "bold",
  },
});

// ==================== 카드 ====================
interface MockCardProps {
  title?: string;
  subtitle?: string;
  highlight?: boolean;
  children?: React.ReactNode;
}

export const MockCard: React.FC<MockCardProps> = ({
  title,
  subtitle,
  highlight = false,
  children,
}) => {
  return (
    <View style={[mockCardStyles.container, highlight && mockCardStyles.highlight]}>
      {title && <Text style={mockCardStyles.title}>{title}</Text>}
      {subtitle && <Text style={mockCardStyles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
};

const mockCardStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: RFValue(8),
    padding: RFValue(10),
    marginHorizontal: RFValue(10),
    marginVertical: RFValue(4),
    borderWidth: 1,
    borderColor: color.gray + "30",
  },
  highlight: {
    borderColor: color.secondary,
    borderWidth: 2,
    shadowColor: color.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: RFValue(12),
    fontWeight: "bold",
    color: color.secondary,
  },
  subtitle: {
    fontSize: RFValue(10),
    color: color.gray,
    marginTop: RFValue(2),
  },
});

// ==================== 다이얼로그 ====================
interface MockDialogProps {
  title: string;
  children?: React.ReactNode;
  buttons?: { text: string; primary?: boolean }[];
  visible?: boolean;
  highlightButton?: boolean;
  buttonRef?: React.RefObject<View | null>;
}

export const MockDialog: React.FC<MockDialogProps> = ({
  title,
  children,
  buttons = [],
  visible = true,
  highlightButton = false,
  buttonRef,
}) => {
  if (!visible) return null;

  return (
    <View style={mockDialogStyles.overlay}>
      <View style={mockDialogStyles.container}>
        <Text style={mockDialogStyles.title}>{title}</Text>
        {children}
        {buttons.length > 0 && (
          <View style={mockDialogStyles.buttonRow}>
            {buttons.map((btn, idx) => (
              <View
                key={idx}
                ref={btn.primary ? buttonRef : undefined}
                style={[
                  mockDialogStyles.button,
                  btn.primary && mockDialogStyles.buttonPrimary,
                  highlightButton && btn.primary && mockDialogStyles.buttonHighlight,
                ]}
              >
                <Text
                  style={[
                    mockDialogStyles.buttonText,
                    btn.primary && mockDialogStyles.buttonTextPrimary,
                  ]}
                >
                  {btn.text}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const mockDialogStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(20),
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: RFValue(12),
    padding: RFValue(16),
    width: "100%",
  },
  title: {
    fontSize: RFValue(14),
    fontWeight: "bold",
    color: color.secondary,
    marginBottom: RFValue(12),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: RFValue(8),
    marginTop: RFValue(12),
  },
  button: {
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(16),
    borderRadius: RFValue(6),
    borderWidth: 1,
    borderColor: color.secondary,
  },
  buttonPrimary: {
    backgroundColor: color.secondary,
  },
  buttonText: {
    fontSize: RFValue(11),
    color: color.secondary,
    fontWeight: "600",
  },
  buttonTextPrimary: {
    color: "#fff",
  },
  buttonHighlight: {
    transform: [{ scale: 1.1 }],
    shadowColor: color.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
});

// ==================== 입력 필드 ====================
interface MockInputProps {
  placeholder?: string;
  value?: string;
  multiline?: boolean;
}

export const MockInput: React.FC<MockInputProps> = ({
  placeholder,
  value,
  multiline = false,
}) => {
  return (
    <View
      style={[mockInputStyles.container, multiline && mockInputStyles.multiline]}
    >
      <Text
        style={[mockInputStyles.text, !value && mockInputStyles.placeholder]}
      >
        {value || placeholder}
      </Text>
    </View>
  );
};

const mockInputStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: color.gray + "60",
    borderRadius: RFValue(4),
    padding: RFValue(8),
    marginVertical: RFValue(4),
  },
  multiline: {
    minHeight: RFValue(60),
  },
  text: {
    fontSize: RFValue(10),
    color: color.secondary,
  },
  placeholder: {
    color: color.gray,
  },
});

// ==================== 멤버 선택 버튼 ====================
interface MockMemberSelectProps {
  selected?: string;
  highlight?: boolean;
}

export const MockMemberSelect: React.FC<MockMemberSelectProps> = ({
  selected,
  highlight = false,
}) => {
  return (
    <View
      style={[
        mockMemberSelectStyles.container,
        highlight && mockMemberSelectStyles.highlight,
      ]}
    >
      <Text
        style={[
          mockMemberSelectStyles.text,
          !selected && mockMemberSelectStyles.placeholder,
        ]}
      >
        {selected || "선택하세요"}
      </Text>
      <MaterialCommunityIcons
        name="chevron-down"
        size={ICON_SIZE_14}
        color={color.gray}
      />
    </View>
  );
};

const mockMemberSelectStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: color.gray + "60",
    borderRadius: RFValue(4),
    padding: RFValue(10),
    marginVertical: RFValue(4),
  },
  highlight: {
    borderColor: color.secondary,
    borderWidth: 2,
  },
  text: {
    fontSize: RFValue(10),
    color: color.secondary,
  },
  placeholder: {
    color: color.gray,
  },
});

// ==================== 검색 입력 ====================
interface MockSearchInputProps {
  placeholder?: string;
  value?: string;
  highlight?: boolean;
}

export const MockSearchInput: React.FC<MockSearchInputProps> = ({
  placeholder = "검색",
  value,
  highlight = false,
}) => {
  return (
    <View
      style={[
        mockSearchInputStyles.container,
        highlight && mockSearchInputStyles.highlight,
      ]}
    >
      <MaterialCommunityIcons
        name="magnify"
        size={ICON_SIZE_14}
        color={color.gray}
      />
      <Text
        style={[
          mockSearchInputStyles.text,
          !value && mockSearchInputStyles.placeholder,
        ]}
      >
        {value || placeholder}
      </Text>
    </View>
  );
};

const mockSearchInputStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.gray + "20",
    borderRadius: RFValue(8),
    padding: RFValue(8),
    marginHorizontal: RFValue(10),
    marginVertical: RFValue(6),
    gap: RFValue(6),
  },
  highlight: {
    borderWidth: 2,
    borderColor: color.secondary,
  },
  text: {
    fontSize: RFValue(10),
    color: color.secondary,
    flex: 1,
  },
  placeholder: {
    color: color.gray,
  },
});

// ==================== 멤버 리스트 아이템 ====================
interface MockMemberItemProps {
  name: string;
  selected?: boolean;
  highlight?: boolean;
}

export const MockMemberItem: React.FC<MockMemberItemProps> = ({
  name,
  selected = false,
  highlight = false,
}) => {
  return (
    <View
      style={[
        mockMemberItemStyles.container,
        highlight && mockMemberItemStyles.highlight,
      ]}
    >
      <View style={mockMemberItemStyles.avatar}>
        <MaterialCommunityIcons
          name="account"
          size={ICON_SIZE_14}
          color={color.gray}
        />
      </View>
      <Text style={mockMemberItemStyles.name}>{name}</Text>
      <View
        style={[
          mockMemberItemStyles.checkbox,
          selected && mockMemberItemStyles.checkboxSelected,
        ]}
      >
        {selected && (
          <MaterialCommunityIcons
            name="check"
            size={ICON_SIZE_10}
            color="#fff"
          />
        )}
      </View>
    </View>
  );
};

const mockMemberItemStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: RFValue(8),
    marginHorizontal: RFValue(10),
    marginVertical: RFValue(2),
    backgroundColor: "#fff",
    borderRadius: RFValue(6),
  },
  highlight: {
    backgroundColor: color.secondary + "20",
  },
  avatar: {
    width: RFValue(24),
    height: RFValue(24),
    borderRadius: RFValue(12),
    backgroundColor: color.gray + "30",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    flex: 1,
    marginLeft: RFValue(8),
    fontSize: RFValue(11),
    color: color.secondary,
  },
  checkbox: {
    width: RFValue(18),
    height: RFValue(18),
    borderRadius: RFValue(9),
    borderWidth: 1,
    borderColor: color.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: color.secondary,
    borderColor: color.secondary,
  },
});

// ==================== 사이드 메뉴 (멤버 목록) ====================
interface MockSideMenuProps {
  members?: string[];
  visible?: boolean;
}

export const MockSideMenu: React.FC<MockSideMenuProps> = ({
  members = [],
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <View style={mockSideMenuStyles.container}>
      <Text style={mockSideMenuStyles.header}>
        현재 인원: {members.length}명
      </Text>
      {members.map((name, idx) => (
        <Text key={idx} style={mockSideMenuStyles.memberName}>
          {name}
        </Text>
      ))}
      <View style={mockSideMenuStyles.buttonContainer}>
        <View style={mockSideMenuStyles.button}>
          <Text style={mockSideMenuStyles.buttonText}>방 초대</Text>
        </View>
      </View>
    </View>
  );
};

const mockSideMenuStyles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    backgroundColor: color.primary,
    padding: RFValue(12),
  },
  header: {
    fontSize: RFValue(11),
    fontWeight: "bold",
    color: color.black,
    paddingBottom: RFValue(8),
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    marginBottom: RFValue(8),
  },
  memberName: {
    fontSize: RFValue(10),
    color: color.black,
    paddingVertical: RFValue(6),
    borderBottomWidth: 0.5,
    borderBottomColor: "#fff",
  },
  buttonContainer: {
    position: "absolute",
    bottom: RFValue(12),
    left: RFValue(12),
    right: RFValue(12),
  },
  button: {
    backgroundColor: color.third,
    borderRadius: RFValue(6),
    paddingVertical: RFValue(10),
    alignItems: "center",
  },
  buttonText: {
    fontSize: RFValue(11),
    fontWeight: "bold",
    color: color.primary,
  },
});
