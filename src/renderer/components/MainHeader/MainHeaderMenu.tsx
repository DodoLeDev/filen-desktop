import React from "react"
import { Flex, Menu, MenuButton, MenuList, MenuItem, MenuDivider, forwardRef } from "@chakra-ui/react"
import { HiOutlineCog, HiOutlineMenu } from "react-icons/hi"
import ipc from "../../lib/ipc"
import colors from "../../styles/colors"
import { IoGlobeOutline } from "react-icons/io5"
import { IoMdClose } from "react-icons/io"
import { i18n } from "../../lib/i18n"
import { MdUploadFile } from "react-icons/md"
import { RiFolderUploadLine } from "react-icons/ri"

const { shell } = window.require("electron")

interface Props {
	userId: number
	email: string
	platform: string
	darkMode: boolean
	lang: string
}

export default class MainHeaderMenu extends React.Component<Props> {
	shouldComponentUpdate(nextProps: any) {
		if (nextProps.darkMode !== this.props.darkMode || nextProps.lang !== this.props.lang) {
			return true
		}

		return false
	}

	render() {
		const { platform, darkMode, lang } = this.props

		return (
			<Flex
				width="32px"
				height="32px"
				backgroundColor="transparent"
				borderRadius={5}
				alignItems="center"
				justifyContent="center"
				cursor="pointer"
				_hover={{
					backgroundColor: colors(platform, darkMode, "backgroundSecondary")
				}}
			>
				<Menu>
					<MenuButton
						as={forwardRef((props, ref) => (
							<Flex
								ref={ref}
								{...props}
							>
								<HiOutlineMenu
									size={24}
									color={colors(platform, darkMode, "textPrimary")}
								/>
							</Flex>
						))}
					>
						{i18n(lang, "actions")}
					</MenuButton>
					<MenuList
						boxShadow="2xl"
						paddingTop="5px"
						paddingBottom="5px"
						backgroundColor={colors(platform, darkMode, "backgroundPrimary")}
						borderColor={colors(platform, darkMode, "borderPrimary")}
						marginRight="-5px"
						minWidth="100px"
					>
						<MenuItem
							height="30px"
							fontSize={13}
							paddingTop="5px"
							paddingBottom="5px"
							icon={
								<HiOutlineCog
									size={17}
									color={colors(platform, darkMode, "textPrimary")}
								/>
							}
							backgroundColor={colors(platform, darkMode, "backgroundPrimary")}
							_hover={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							_active={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							_focus={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							onClick={() => ipc.openSettingsWindow()}
						>
							{i18n(lang, "settings")}
						</MenuItem>
						<MenuItem
							height="30px"
							fontSize={13}
							paddingTop="5px"
							paddingBottom="5px"
							icon={
								<RiFolderUploadLine
									size={17}
									color={colors(platform, darkMode, "textPrimary")}
								/>
							}
							backgroundColor={colors(platform, darkMode, "backgroundPrimary")}
							_hover={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							_active={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							_focus={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							onClick={() => ipc.openUploadWindow("folders")}
						>
							{i18n(lang, "keybinds_uploadFolders")}
						</MenuItem>
						<MenuItem
							height="30px"
							fontSize={13}
							paddingTop="5px"
							paddingBottom="5px"
							icon={
								<MdUploadFile
									size={17}
									color={colors(platform, darkMode, "textPrimary")}
								/>
							}
							backgroundColor={colors(platform, darkMode, "backgroundPrimary")}
							_hover={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							_active={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							_focus={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							onClick={() => ipc.openUploadWindow("files")}
						>
							{i18n(lang, "keybinds_uploadFiles")}
						</MenuItem>
						<MenuItem
							height="30px"
							fontSize={13}
							paddingTop="5px"
							paddingBottom="5px"
							icon={
								<IoGlobeOutline
									size={17}
									color={colors(platform, darkMode, "textPrimary")}
								/>
							}
							backgroundColor={colors(platform, darkMode, "backgroundPrimary")}
							_hover={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							_active={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							_focus={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							onClick={() => shell.openExternal("https://filen.io/my-account/file-manager/")}
						>
							{i18n(lang, "openWebsite")}
						</MenuItem>
						<MenuDivider
							backgroundColor={colors(platform, darkMode, "backgroundPrimary")}
							color={colors(platform, darkMode, "backgroundPrimary")}
						/>
						<MenuItem
							height="30px"
							fontSize={13}
							paddingTop="5px"
							paddingBottom="5px"
							icon={
								<IoMdClose
									size={17}
									color={colors(platform, darkMode, "textPrimary")}
								/>
							}
							backgroundColor={colors(platform, darkMode, "backgroundPrimary")}
							_hover={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							_active={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							_focus={{
								backgroundColor: colors(platform, darkMode, "backgroundSecondary")
							}}
							onClick={() => ipc.quitApp()}
						>
							{i18n(lang, "quitFilen")}
						</MenuItem>
					</MenuList>
				</Menu>
			</Flex>
		)
	}
}
