package interfaces

import "github.com/gin-gonic/gin"

type SharedLibraryControllerInterface interface {
	InsertSharedLibrary(c *gin.Context)
	GetSharedLibrary(c *gin.Context)
}
